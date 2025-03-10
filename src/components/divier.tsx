'use client'
const Divier = ({ text }: DivierProps) => {
  return (
    <div className="my-12 flex items-center">
      {text &&
        <h1 className="text-xs p-2 bg-primary rounded-s text-background inline-flex uppercase
          font-semibold leading-[110%] -order-1">{text}</h1>
      }
      <div className="w-full h-0.5 bg-primary" />
    </div>
  );
};
export default Divier
