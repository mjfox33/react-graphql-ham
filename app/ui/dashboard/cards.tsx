import {
  BanknotesIcon,
  ClockIcon,
  UsersIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { rubik } from '@/app/ui/fonts';
import { fetchDashboardCardData } from '@/app/lib/data';

const iconMap = {
  earned: BanknotesIcon,
  sellers: UsersIcon,
  awaiting: ClockIcon,
  invoices: ClipboardDocumentIcon,
};

export default async function CardWrapper() {
  const {
    numberOfActive,
    numberOfPendingTerm,
    numberOfTerminated,
    numberOfActiveInNC
  } = await fetchDashboardCardData();

  return (
    <>
      <Card title="Active in NC" value={numberOfActiveInNC} type="earned" />
      <Card title="Pending Termination" value={numberOfPendingTerm} type="awaiting" />
      <Card title="Terminated" value={numberOfTerminated} type="invoices" />
      <Card title="Total Active" value={numberOfActive} type="sellers" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'sellers' | 'awaiting' | 'earned';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-neutral-700 p-2 shadow-sm">
      <div className="flex bg-neutral-700 p-4">
        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}
        <h3 className="ml-2 text-sm font-medium text-white">{title}</h3>
      </div>
      <p
        className={`${rubik.className}
          truncate rounded-xl bg-sky-700 px-4 py-8 text-center text-2xl text-white`}
      >
        {value}
      </p>
    </div>
  );
}
