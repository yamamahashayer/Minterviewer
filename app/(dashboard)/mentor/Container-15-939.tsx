function Text() {
  return (
    <div className="h-[28px] relative shrink-0 w-[27.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[28px] items-start relative w-[27.469px]">
        <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[20px] text-neutral-950">🎯</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative rounded-[3.35544e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Text />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Minterviewer</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Your AI Career Coach</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[40px] relative shrink-0 w-[111.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[40px] items-start relative w-[111.703px]">
        <Heading2 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

export default function Container3() {
  return (
    <div className="relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-px pt-[24px] px-[24px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}