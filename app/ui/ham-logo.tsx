import { RadioIcon } from '@heroicons/react/24/outline';
import { rubik } from '@/app/ui/fonts';

export default function HamLogo() {
  return (
    <div className={`${rubik.className} flex flex-row items-center leading-none text-white `}>
      <RadioIcon className='mr-6 h-16 w-16' />
      <p className="text-[44px]">React GraphQl Ham Hub</p>
    </div>
  );
}
