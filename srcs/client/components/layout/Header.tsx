import Image from 'next/image';
// import faviconImage from '@/assets/icoico_favicon.png';
import logoImage from '@/assets/icoico.png';


export const Header = () => {
  return (
    <header className='flex justify-center items-center pt-4 mb-0'>
      <div className='w-1/2 flex justify-center pb-4'>
        {/* <Image src={faviconImage} alt='logo' className='w-30 h-auto' /> */}
        <Image src={logoImage} alt='logo' className='w-80 h-auto' />
      </div>
    </header>
  );
};
