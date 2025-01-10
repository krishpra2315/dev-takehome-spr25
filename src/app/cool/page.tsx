import Image from 'next/image';

export default function Kewl() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary text-white gap-5">
      {/* 
      Write something unique about you here! 
      It could be a club you're part of, a weird skill you have, or something special that happened to you.
      Feel free to put links, images, whatever! 
      Don't worry about styling- we aren't grading you on this- it's just to get to know you better! :) 
      */}
      I Love Chipotle!
      <Image src="/cool.jpg" alt="Cool Image" width={300} height={200} />
      Proof: ^
    </div>
  );
}
