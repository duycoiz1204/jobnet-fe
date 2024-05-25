'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { format, parse } from 'date-fns';
import { toast } from 'sonner';
import useModal from '@/hooks/useModal';

import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa6';
import PostDetailsInfo from '@/components/PostDetailsInfo';
import Modal from '@/components/modal/Modal';
import InputWithLabel from '@/components/input/InputWithLabel';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/input/DateInput';
import TinyEditor from '@/components/TinyEditor';
import TextareaWithLabel from '@/components/textarea/TextareaWithLabel';
import Selection, { SelectChangeEvent } from '@/components/select/Selection';
import { ListInputChangeEvent } from '@/components/input/ListInput';
import LocationInput, {
  LocationInputChangeEvent,
} from '@/components/input/LocationInput';
import TagsInput, { TagsInputChangeEvent } from '@/components/input/TagsInput';
import { Radio } from '@radix-ui/react-radio-group';
import LabelSection from '@/components/LabelSection';

import postService from '@/services/postService';
import PostType from '@/types/post';
import levelService from '@/services/levelService';
import benefitService from '@/services/benefitService';

import ErrorType from '@/types/error';
import { useParams } from 'next/navigation';
import professionService from '@/services/professionService';
import { set } from 'zod';
import ProfessionType from '@/types/profession';

const initHeadingInfo = (post: PostType) => ({
  title: post.title || '',
  locations: post.locations || [],
  yearsOfExperience: post.yearsOfExperience || '',
  minSalaryString: post.minSalaryString || '',
  maxSalaryString: post.maxSalaryString || '',
  requisitionNumber: post.requisitionNumber || '',
  applicationDeadline: format(
    parse(post.applicationDeadline, 'dd/MM/yyyy', new Date()),
    'yyyy-MM-dd'
  ),
});

const initDetailedInfo = (post: PostType) => ({
  description: post.description || '',
  otherRequirements: post.otherRequirements || '',
});

const initGeneralInfo = (post: PostType) => ({
  levelId: post.level.id || [],
  //   degrees: post.degrees || [],
  professionId: post.profession?.id,
  benefitIds: post.benefits.map((benefit) => benefit.id) || [],
  workingFormat: post.workingFormat || '',
  //   internalContact: post.internalContact || '',
});

export default function PostUpdate() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [post, setPost] = useState<PostType>(undefined!);
  const [professions, setProfessions] = useState<ProfessionType[]>(undefined!);
  const [headingInfo, setHeadingInfo] = useState(initHeadingInfo(post));
  const [detailedInfo, setDetailedInfo] = useState(initDetailedInfo(post));
  const [generalInfo, setGeneralInfo] = useState(initGeneralInfo(post));
  const { modal, openModal, closeModal } = useModal();

  useEffect(() => {
    (async () => {
      const _post = await postService.getPostById(params.id);
      setPost(_post);
      const _professions = await professionService.getProfessions();
      setProfessions(_professions);
    })();
  }, [params.id]);

  const handleLevelsSearch = async (name: string) => {
    const levels = await levelService.getLevels({ search: name });
    return levels;
  };

  const handleBenefitsSearch = async (name: string) => {
    const benefits = await benefitService.getBenefits({ search: name });

    return benefits;
  };

  const handleBenefitCreate = async (name: string) => {
    try {
      const benefit = await benefitService.createBenefit({ name });
      return benefit;
    } catch (err) {
      toast.error((err as ErrorType).message);
    }
  };

  const handleHeadingInfoChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | SelectChangeEvent
        | ListInputChangeEvent
        | LocationInputChangeEvent
    ) =>
      setHeadingInfo((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      })),
    []
  );

  const handleDetailedInfoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDetailedInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGeneralInfoChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | SelectChangeEvent
        | TagsInputChangeEvent
    ) =>
      setGeneralInfo((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      })),
    []
  );

  const handleHeadingInfoUpdateClick = () => {
    if (
      !headingInfo.title ||
      !headingInfo.locations.length ||
      !headingInfo.yearsOfExperience ||
      !headingInfo.minSalaryString ||
      !headingInfo.maxSalaryString ||
      !headingInfo.requisitionNumber ||
      !headingInfo.applicationDeadline
    ) {
      toast.error(t('recruiter.postUpdate.action.error.requireField'));
      return;
    }

    void (async () => {
      try {
        const _post = await postService.updatePostHeadingInfo(
          params.id,
          headingInfo
        );
        setPost(_post);
        closeModal();
        toast.success(t('recruiter.postUpdate.action.success'));
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  const handleDetailedInfoUpdateClick = () => {
    if (!detailedInfo.description || !detailedInfo.otherRequirements) {
      toast.error(t('recruiter.postUpdate.action.error.requireField'));
      return;
    }

    void (async () => {
      try {
        const post = await postService.updatePostDetailedInfo(
          params.id,
          detailedInfo
        );
        setPost(post);
        closeModal();
        toast.success(t('recruiter.postUpdate.action.success'));
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  const handleGeneralInfoUpdateClick = () => {
    if (
      !generalInfo.levelId ||
      // !generalInfo.degrees ||
      !generalInfo.professionId ||
      !generalInfo.benefitIds ||
      !generalInfo.workingFormat
      // !generalInfo.internalContact
    ) {
      toast.error(t('recruiter.postUpdate.action.error.requireField'));
      return;
    }

    void (async () => {
      try {
        const post = await postService.updatePostGeneralInfo(
          params.id,
          generalInfo
        );
        setPost(post);
        closeModal();
        toast.success(t('recruiter.postUpdate.action.success'));
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  return (
    <div className="px-2 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t('recruiter.postCreation.title')}
        </h2>
        <Button color="slate" size={'sm'} onClick={() => router.push('../')}>
          <FaArrowLeft className="w-4 h-4 mr-2" />
          {t('recruiter.postUpdate.buttons.back')}
        </Button>
      </div>

      {post && (
        <PostDetailsInfo
          post={post}
          type="Update"
          handleClickUpdateHeading={() => {
            openModal('post-heading-info-update-modal');
          }}
          handleClickUpdateDetails={() => {
            openModal('detailed-info-update-modal');
          }}
          handleClickUpdateGeneral={() => {
            openModal('general-info-update-modal');
          }}
        />
      )}

      <Modal
        id="post-heading-info-update-modal"
        show={modal === 'post-heading-info-update-modal'}
        size="2xl"
        onClose={closeModal}
      >
        <Modal.Header>{t('recruiter.postUpdate.title')}</Modal.Header>
        <Modal.Body className="space-y-5">
          <InputWithLabel
            id="title"
            name="title"
            label={`${t('recruiter.postCreation.inputs.title.label')} :`}
            placeholder={t('recruiter.postCreation.inputs.title.placeholder')}
            type="text"
            color="emerald"
            value={headingInfo.title}
            onChange={handleHeadingInfoChange}
          />
          <LocationInput
            label={`${t('recruiter.postCreation.inputs.locationInput.label')}`}
            value={headingInfo.locations[0]}
            onLocationsChange={handleHeadingInfoChange}
          />

          <Selection
            id="yearsOfExperience"
            name="yearsOfExperience"
            label={`${t('recruiter.postCreation.inputs.exp.label')} :`}
            options={[
              {
                id: 'Dưới 1 năm',
                name: t('recruiter.postCreation.inputs.exp.options.option1'),
              },
              {
                id: '1 - 2 năm',
                name: t('recruiter.postCreation.inputs.exp.options.option2'),
              },
              {
                id: '3 - 5 năm',
                name: t('recruiter.postCreation.inputs.exp.options.option3'),
              },
              {
                id: '5 năm trở lên',
                name: t('recruiter.postCreation.inputs.exp.options.option4'),
              },
            ]}
            value={headingInfo.yearsOfExperience}
            onSelectChange={handleHeadingInfoChange}
          />
          <LabelSection
            className="gap-2"
            label={t('recruiter.postCreation.inputs.salary.label')}
          >
            <div className="flex items-center justify-start">
              <Input
                id="minSalary"
                name="minSalary"
                type="text"
                placeholder={t(
                  'recruiter.postCreation.inputs.salary.placeholder.min'
                )}
                value={headingInfo.minSalaryString}
                onChange={handleHeadingInfoChange}
              />
              <span className="px-3">-</span>
              <Input
                id="maxSalary"
                name="maxSalary"
                type="text"
                placeholder={t(
                  'recruiter.postCreation.inputs.salary.placeholder.max'
                )}
                value={headingInfo.maxSalaryString}
                onChange={handleHeadingInfoChange}
              />
            </div>
          </LabelSection>
          <div className="grid grid-cols-2 gap-x-6">
            <InputWithLabel
              id="requisitionNumber"
              name="requisitionNumber"
              label={`${t(
                'recruiter.postCreation.inputs.requisitionNumber.label'
              )} :`}
              type="number"
              placeholder={t(
                'recruiter.postCreation.inputs.requisitionNumber.placeholder'
              )}
              value={headingInfo.requisitionNumber}
              onChange={handleHeadingInfoChange}
            />
            <DateInput
              id="applicationDeadline"
              name="applicationDeadline"
              label={t(
                'recruiter.postCreation.inputs.applicationDeadline.label'
              )}
              value={headingInfo.applicationDeadline}
              onChange={handleHeadingInfoChange}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button color="emerald" onClick={handleHeadingInfoUpdateClick}>
              {t('recruiter.postUpdate.buttons.update')}
            </Button>
            <Button color="red" onClick={closeModal}>
              {t('recruiter.postUpdate.buttons.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="detailed-info-update-modal"
        show={modal === 'detailed-info-update-modal'}
        size="5xl"
        onClose={closeModal}
      >
        <Modal.Header>{t('recruiter.postUpdate.title')}</Modal.Header>
        <Modal.Body className="space-y-5">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">
              {t('recruiter.postCreation.inputs.desc.label')}
            </label>
            <TinyEditor
              id="description"
              name="description"
              data={detailedInfo.description}
              value={detailedInfo.description}
              onChange={void handleDetailedInfoChange}
            />
          </div>
          <TextareaWithLabel
            id="otherRequirements"
            name="otherRequirements"
            className="h-40 resize-none"
            label={`${t(
              'recruiter.postCreation.inputs.otherRequirements.label'
            )} :`}
            placeholder={t(
              'recruiter.postCreation.inputs.otherRequirements.placeholder'
            )}
            value={detailedInfo.otherRequirements}
            onChange={handleDetailedInfoChange}
          />

          <div className="flex justify-end gap-4">
            <Button color="emerald" onClick={handleDetailedInfoUpdateClick}>
              {t('recruiter.postUpdate.buttons.update')}
            </Button>
            <Button color="red" onClick={closeModal}>
              {t('recruiter.postUpdate.buttons.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="general-info-update-modal"
        show={modal === 'general-info-update-modal'}
        size="2xl"
        onClose={closeModal}
      >
        <Modal.Header>{t('recruiter.postUpdate.title')}</Modal.Header>
        <Modal.Body className="space-y-5">
          {/* <TagsInput
            id="levelIds"
            name="levelIds"
            label={`${t('recruiter.postCreation.inputs.level.label')} :`}
            placeholder={t('recruiter.postCreation.inputs.level.label')}
            tags={post.level}
            onHintsSearch={handleLevelsSearch}
            onTagsInputChange={handleGeneralInfoChange}
          /> */}
          {/* <TagsInput
            id="degrees"
            name="degrees"
            label={`${t('recruiter.postCreation.inputs.degree.label')} :`}
            placeholder={t(
              'recruiter.postCreation.inputs.degree.options.option1'
            )}
            tags={post.degrees.map((degree) => ({ id: degree, name: degree }))}
            hints={[
              {
                id: t('recruiter.postCreation.inputs.degree.options.option1'),
                name: t('recruiter.postCreation.inputs.degree.options.option1'),
              },
              {
                id: t('recruiter.postCreation.inputs.degree.options.option2'),
                name: t('recruiter.postCreation.inputs.degree.options.option2'),
              },
            ]}
            onTagsInputChange={handleGeneralInfoChange}
          /> */}
          <div className="grid grid-cols-2 gap-x-6">
            <Selection
              id="professionId"
              name="professionId"
              label={`${t('recruiter.postCreation.inputs.profession.label')} :`}
              options={professions}
              value={generalInfo.professionId}
              onSelectChange={handleGeneralInfoChange}
            />
            <TagsInput
              id="benefitIds"
              name="benefitIds"
              label={`${t('recruiter.postCreation.inputs.benefit.label')} :`}
              placeholder={t(
                'recruiter.postCreation.inputs.benefit.placeholder'
              )}
              tags={post.benefits}
              onHintsSearch={handleBenefitsSearch}
              onHintCreate={handleBenefitCreate}
              onTagsInputChange={handleGeneralInfoChange}
            />
          </div>
          <LabelSection
            className="gap-4"
            label={`${t(
              'recruiter.postCreation.inputs.workingFormat.label'
            )} :`}
          >
            <div className="grid grid-cols-3">
              <div>
                <Input
                  id="full-time"
                  name="workingFormat"
                  className="mr-2"
                  value="full-time"
                  checked={generalInfo.workingFormat === 'full-time'}
                  onChange={handleGeneralInfoChange}
                />
                <label htmlFor="full-time">
                  {t(
                    'recruiter.postCreation.inputs.workingFormat.options.fulltime'
                  )}
                </label>
              </div>
              <div>
                <Input
                  id="part-time"
                  name="workingFormat"
                  type="radio"
                  className="mr-2"
                  value="part-time"
                  checked={generalInfo.workingFormat === 'part-time'}
                  onChange={handleGeneralInfoChange}
                />
                <label htmlFor="part-time">
                  {t(
                    'recruiter.postCreation.inputs.workingFormat.options.parttime'
                  )}
                </label>
              </div>
              <div>
                <Input
                  id="intern"
                  name="workingFormat"
                  type="radio"
                  className="mr-2"
                  value="intern"
                  checked={generalInfo.workingFormat === 'intern'}
                  onChange={handleGeneralInfoChange}
                />
                <label htmlFor="intern">
                  {t(
                    'recruiter.postCreation.inputs.workingFormat.options.intern'
                  )}
                </label>
              </div>
            </div>
          </LabelSection>
          {/* <TextareaWithLabel
            id="internalContact"
            name="internalContact"
            label={t('recruiter.postCreation.inputs.internalContact.label')}
            placeholder={t(
              'recruiter.postCreation.inputs.internalContact.placeholder'
            )}
            value={generalInfo.internalContact}
            onChange={handleGeneralInfoChange}
          /> */}
          <div className="flex justify-end gap-4">
            <Button color="emerald" onClick={handleGeneralInfoUpdateClick}>
              {t('recruiter.postUpdate.buttons.update')}
            </Button>
            <Button color="red" onClick={closeModal}>
              {t('recruiter.postUpdate.buttons.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
