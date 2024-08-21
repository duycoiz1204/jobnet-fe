'use client'
import BusinessInfo from '@/components/BusinessInfo'
import FileUpload from '@/components/input/FileUpload'
import { ListInputChangeEvent } from '@/components/input/ListInput'
import LocationInput, { LocationInputChangeEvent } from '@/components/input/LocationInput'
import Modal from '@/components/modal/Modal'
import Selection from '@/components/select/Selection'
import { SelectChangeEvent } from '@/components/select/Selection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useModal from '@/hooks/useModal'
import businessService from '@/services/businessService'
import BusinessType from '@/types/business'
import ErrorType from '@/types/error'
import { useSession } from 'next-auth/react'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'


const initGeneralInfo = (business: BusinessType) => ({
    name: business.name,
    type: business.type,
    country: business.country || '',
    employeeQuantity: business.employeeQuantity,
    foundedYear: business.foundedYear || '',
})

const initIntroductionInfo = (business: BusinessType) => ({
    description: business.description || '',
})

const initContactInfo = (business: BusinessType) => ({
    phone: business.phone,
    website: business.website,
    locations: business.locations,
})

interface MyBusinessLoader {
    business: BusinessType
}

interface MyBusinessProps {
    _business: BusinessType
}

export default function MyBusiness({ _business }: MyBusinessProps): JSX.Element {

    const [business, setBusiness] = useState(_business)

    const [backgroundImage, setBackgroundImage] = useState<File>()
    const [profileImage, setProfileImage] = useState<File>()
    const [generalInfo, setGeneralInfo] = useState(initGeneralInfo(business))
    const [introductionInfo, setIntroductionInfo] = useState(
        initIntroductionInfo(business)
    )
    const [contactInfo, setContactInfo] = useState(initContactInfo(business))

    const { modal, openModal, closeModal } = useModal()

    const session = useSession()

    const handleBackgroundImageSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setBackgroundImage(e.target.files?.[0])

    const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
        setProfileImage(e.target.files?.[0])

    const handleGeneralInfoChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) =>
            setGeneralInfo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            })),
        []
    )

    const handleIntroductionInfoChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
        setIntroductionInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))

    const handleContactInfoChange = useCallback(
        (
            e:
                | React.ChangeEvent<HTMLInputElement>
                | ListInputChangeEvent
                | LocationInputChangeEvent
        ) => {
            setContactInfo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }))
        },
        []
    )

    const handleBackgroundImageUpload = () => {
        if (!backgroundImage) {
            toast.error('Vui lòng chọn ảnh nền!')
            return
        }

        const formData = new FormData()
        formData.append('file', backgroundImage)

        void (async () => {
            try {
                const business = await businessService.uploadBusinessBackgroundImage(
                    _business.id,
                    formData
                )
                setBusiness(business)
                setBackgroundImage(undefined)
                closeModal()
                toast.success('Cập nhật ảnh nền thành công.')
            } catch (err) {
                toast.error((err as ErrorType).message)
            }
        })()
    }

    const handleProfileImageUpload = () => {
        if (!profileImage) {
            toast.error('Vui lòng chọn ảnh đại diện!')
            return
        }

        const formData = new FormData()
        formData.append('file', profileImage)

        void (async () => {
            try {
                const business = await businessService.uploadBusinessProfileImage(
                    _business.id,
                    formData
                )
                setBusiness(business)
                setProfileImage(undefined)
                closeModal()
                toast.success('Cập nhật ảnh nền thành công.')
            } catch (err) {
                toast.error((err as ErrorType).message)
            }
        })()
    }

    const handleGeneralInfoUpdate = () => {
        if (
            !generalInfo.name ||
            !generalInfo.type ||
            !generalInfo.country ||
            !generalInfo.employeeQuantity ||
            !generalInfo.foundedYear
        ) {
            toast.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        void (async () => {
            try {
                const business = await businessService.updateBusinessGeneralInfo(
                    _business.id,
                    generalInfo,
                    session.data!!.accessToken
                )
                setBusiness(business)
                closeModal()
                toast.success('Cập nhật thông tin thành công.')
            } catch (err) {
                toast.error((err as ErrorType).message)
            }
        })()
    }

    const handleIntroductionInfoUpdate = () => {
        if (!introductionInfo.description) {
            toast.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        void (async () => {
            try {
                const business = await businessService.updateBusinessIntroductionInfo(
                    _business.id,
                    introductionInfo,
                    session.data!!.accessToken
                )
                setBusiness(business)
                closeModal()
                toast.success('Cập nhật thông tin thành công.')
            } catch (err) {
                toast.error((err as ErrorType).message)
            }
        })()
    }

    const handleContactInfoUpdate = () => {
        if (!contactInfo.phone || !contactInfo.website) {
            toast.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        void (async () => {
            try {
                const business = await businessService.updateBusinessContactInfo(
                    _business.id,
                    contactInfo,
                    session.data!!.accessToken
                )
                setBusiness(business)
                closeModal()
                toast.success('Cập nhật thông tin thành công.')
            } catch (err) {
                toast.error((err as ErrorType).message)
            }
        })()
    }

    const handleGeneralInfoModalClose = () => {
        setGeneralInfo(initGeneralInfo(business))
        closeModal()
    }

    const handleIntroductionInfoModalClose = () => {
        setIntroductionInfo(initIntroductionInfo(business))
        closeModal()
    }

    const handleContactInfoModalClose = () => {
        setContactInfo(initContactInfo(business))
        closeModal()
    }

    return (
        <>
            <BusinessInfo mode="update" business={business} openModal={openModal} />

            <Modal
                id="background-image-upload-modal"
                show={modal === 'background-image-upload-modal'}
                onClose={closeModal}
            >
                <Modal.Header>Cập nhật ảnh bìa</Modal.Header>
                <Modal.Body>
                    <FileUpload
                        onFileSelect={handleBackgroundImageSelect}
                        onFileUpload={handleBackgroundImageUpload}
                        onModalClose={closeModal}
                    />
                </Modal.Body>
            </Modal>

            <Modal
                id="profile-image-upload-modal"
                show={modal === 'profile-image-upload-modal'}
                onClose={closeModal}
            >
                <Modal.Header>Cập nhật ảnh đại diện</Modal.Header>
                <Modal.Body>
                    <FileUpload
                        onFileSelect={handleProfileImageSelect}
                        onFileUpload={handleProfileImageUpload}
                        onModalClose={closeModal}
                    />
                </Modal.Body>
            </Modal>

            <Modal
                id="general-info-update-modal"
                show={modal === 'general-info-update-modal'}
                onClose={handleGeneralInfoModalClose}
                size="xl"
            >
                <Modal.Header>Cập nhật thông tin công ty</Modal.Header>
                <Modal.Body className="space-y-5">
                    <Label htmlFor='name'>Tên công ty:</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Nhập tên công ty"
                        type="text"
                        color="emerald"
                        value={generalInfo.name}
                        onChange={handleGeneralInfoChange}
                    />
                    <div className="grid grid-cols-2 gap-x-4">
                        <Selection
                            id="type"
                            name="type"
                            label="Loại hình doanh nghiệp:"
                            options={[
                                { id: 'Product', name: 'Product' },
                                { id: 'Outsource', name: 'Outsource' },
                            ]}
                            value={generalInfo.type}
                            onSelectChange={handleGeneralInfoChange}
                        />
                        <Selection
                            id="country"
                            name="country"
                            label="Quốc gia:"
                            options={[{ id: 'Việt Nam', name: 'Việt Nam' }]}
                            value={generalInfo.country}
                            onSelectChange={handleGeneralInfoChange}
                        />
                    </div>
                    <Label htmlFor='employeeQuantity'>Quy mô nhân viên:</Label>
                    <Input
                        id="employeeQuantity"
                        name="employeeQuantity"
                        placeholder="Nhập số lượng nhân viên"
                        type="text"
                        color="emerald"
                        value={generalInfo.employeeQuantity}
                        onChange={handleGeneralInfoChange}
                    />
                    <Label htmlFor='foundedYear'>Năm thành lập:</Label>
                    <Input
                        id="foundedYear"
                        name="foundedYear"
                        placeholder="Nhập năm thành lập"
                        type="text"
                        color="emerald"
                        value={generalInfo.foundedYear}
                        onChange={handleGeneralInfoChange}
                    />

                    <div className="flex justify-end gap-4">
                        <Button variant="emerald" onClick={handleGeneralInfoUpdate}>
                            Cập nhật
                        </Button>
                        <Button variant="red" onClick={handleGeneralInfoModalClose}>
                            Hủy
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                id="introduction-info-update-modal"
                show={modal === 'introduction-info-update-modal'}
                onClose={handleIntroductionInfoModalClose}
                size="3xl"
            >
                <Modal.Header>Cập nhật thông tin giới thiệu</Modal.Header>
                <Modal.Body className="space-y-5">
                    <Label htmlFor='description'>Nhập mô tả về công ty:</Label>
                    <Textarea
                        id="description"
                        name="description"
                        rows={12}
                        value={introductionInfo.description}
                        onChange={handleIntroductionInfoChange}
                    />
                    <div className="flex justify-end gap-4">
                        <Button color="emerald" onClick={handleIntroductionInfoUpdate}>
                            Cập nhật
                        </Button>
                        <Button color="red" onClick={handleIntroductionInfoModalClose}>
                            Hủy
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                id="contact-info-update-modal"
                show={modal === 'contact-info-update-modal'}
                onClose={handleContactInfoModalClose}
                size="xl"
            >
                <Modal.Header>Cập nhật thông tin liên hệ</Modal.Header>
                <Modal.Body className="space-y-5">
                    <Label htmlFor='phone'>Số điện thoại:</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="Nhập số điện thoại công ty"
                        type="text"
                        color="emerald"
                        value={contactInfo.phone}
                        onChange={handleContactInfoChange}
                    />
                    <Label htmlFor='website'>Liên kết đến website:</Label>
                    <Input
                        id="website"
                        name="website"
                        placeholder="Nhập liên kết website"
                        type="text"
                        color="emerald"
                        value={contactInfo.website}
                        onChange={handleContactInfoChange}
                    />
                    <LocationInput
                        values={contactInfo.locations || []}
                        onLocationsChange={handleContactInfoChange}
                    />
                    <div className="flex justify-end gap-4">
                        <Button onClick={handleContactInfoUpdate}>Cập nhật</Button>
                        <Button color="red" onClick={handleContactInfoModalClose}>
                            Hủy
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
