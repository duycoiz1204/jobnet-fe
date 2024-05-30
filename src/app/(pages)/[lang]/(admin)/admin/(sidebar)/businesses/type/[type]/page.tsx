import ADBusinessTable from '@/components/table/ADBusinessTable';
import businessService from '@/services/businessService';

async function ADBussinesses({ params }: { params: { type: string } }) {
  const table = await initTable(params.type);
  return (
    <ADBusinessTable
      loaderData={table.businesses}
      {...table.BusinessPageParams}
    />
  );
}

export default ADBussinesses;

const initTable = async (type: string) => {
  if (type === 'Pending' || type === 'Approved' || type === 'Rejected') {
    const businessPending = await businessService.getBusinesses({
      status: type,
    });
    return {
      businesses: businessPending,
      BusinessPageParams: { status: type },
    };
  }

  const business = await businessService.getBusinesses({});
  return { businesses: business, BusinessPageParams: {} };
};
