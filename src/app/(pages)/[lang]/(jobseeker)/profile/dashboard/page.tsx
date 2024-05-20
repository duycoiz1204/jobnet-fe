import jobSeekerService from '@/services/jobSeekerService';
import applicationService from '@/services/applicationService';
import resumeService from '@/services/resumeService';
import JSDashboardCpn from '@/app/(pages)/[lang]/(jobseeker)/profile/dashboard/JSDashboardCpn';
import { auth } from '@/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JobSeeker Dashboard",
  description: "Dashboard for JobSeeker in our Jobnet Website",
};


export default async function JSDashboard(): Promise<JSX.Element> {
  const session = await auth()
  const accessToken = session!!.accessToken as string
  const _jobSeeker = await jobSeekerService.getJobSeekerById(
    session?.user.id as string
  );
  const _application = await applicationService.getApplications({
    jobSeekerId: session?.user.id as string,
    accessToken: accessToken
  });
  const _resumes = await resumeService.getResumesByAuth(
    session?.accessToken!!
  );
  return (
    <JSDashboardCpn jobSeeker={_jobSeeker} applications={_application} resumes={_resumes} />
  );
}
