import svgPaths from "./svg-975l3kqwgd";

function Heading1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-[-2px] whitespace-pre">{`Messages & Feedback 💬`}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Communication from AI coaches and system updates</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[68px] relative shrink-0 w-[375.312px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-start relative w-[375.312px]">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[rgba(0,187,167,0.2)] h-[22px] relative rounded-[8px] shrink-0 w-[67.625px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[67.625px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#46ecd5] text-[12px] text-nowrap whitespace-pre">2 Unread</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex h-[68px] items-center justify-between left-0 top-0 w-[1198px]" data-name="Container">
      <Container />
      <Badge />
    </div>
  );
}

function Container2() {
  return <div className="absolute bg-gradient-to-b from-[#5eead4] h-[4px] left-0 rounded-[3.35544e+07px] shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)] to-[rgba(0,0,0,0)] top-[84px] w-[200px]" data-name="Container" />;
}

function Container3() {
  return (
    <div className="h-[88px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[36px] left-0 rounded-[8px] top-0 w-[349.328px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[349.328px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Search messages...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <Icon />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[69px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[69px] items-start pb-px pt-[16px] px-[16px] relative w-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="basis-0 bg-[rgba(94,234,212,0.1)] grow h-[34px] min-h-px min-w-px relative shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[#46ecd5] border-[1px_1px_2px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[34px] items-center justify-center pb-[6px] pt-[5px] px-[9px] relative w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#46ecd5] text-[14px] text-nowrap whitespace-pre">All</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="basis-0 grow h-[34px] min-h-px min-w-px relative shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[1px_1px_2px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[34px] items-center justify-center pb-[6px] pt-[5px] px-[9px] relative w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Unread (2)</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="basis-0 grow h-[34px] min-h-px min-w-px relative shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[1px_1px_2px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[34px] items-center justify-center pb-[6px] pt-[5px] px-[9px] relative w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Starred</p>
        </div>
      </div>
    </div>
  );
}

function TabList() {
  return (
    <div className="h-[36px] relative shrink-0 w-[381.328px]" data-name="Tab List">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[36px] items-center justify-center pb-px pt-0 px-0 relative w-[381.328px]">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.297px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start overflow-clip relative rounded-[inherit] w-[93.297px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">AI Coach Sarah</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Icon1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Great Progress on Technical Interview!</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[374px]">{`You've shown excellent improvement in your technical interview skills...`}</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_15_1245)" id="Icon">
          <path d="M3.5 5V11" id="Vector" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pd036b00} id="Vector_2" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_15_1245">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">2 hours ago</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#00d5be] relative rounded-[3.35544e+07px] shrink-0 size-[8px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[8px]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon2 />
      <Text />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[88px] items-start left-[52px] top-0 w-[274.328px]" data-name="Container">
      <Container6 />
      <Paragraph1 />
      <Paragraph2 />
      <Container8 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M9 6V3H6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3e254b00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 10.5H3" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15 10.5H16.5" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11.25 9.75V11.25" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 9.75V11.25" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <Icon3 />
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text1 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[88px] left-[16px] top-[16px] w-[326.328px]" data-name="Container">
      <Container9 />
      <PrimitiveSpan />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(94,234,212,0.03)] h-[121px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container10 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-0 w-[128.25px]" data-name="Heading 4">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Minterviewer System</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-[24px] w-[274.328px]" data-name="Paragraph">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">New Achievement Unlocked: Top Performer</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[48px] w-[274.328px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[290px]">{`Congratulations! You've unlocked a new achievement...`}</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_15_1242)" id="Icon">
          <path d={svgPaths.p295e8380} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_15_1242">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">5 hours ago</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#00d5be] relative rounded-[3.35544e+07px] shrink-0 size-[8px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[8px]" />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[72px] w-[274.328px]" data-name="Container">
      <Icon4 />
      <Text2 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[88px] left-[52px] top-0 w-[274.328px]" data-name="Container">
      <Heading5 />
      <Paragraph3 />
      <Paragraph4 />
      <Container12 />
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">S</p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[88px] left-[16px] top-[16px] w-[326.328px]" data-name="Container">
      <Container13 />
      <PrimitiveSpan1 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(94,234,212,0.03)] h-[121px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container14 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-0 w-[89.063px]" data-name="Heading 4">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">AI Coach Mike</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-[24px] w-[274.328px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[14px]">System Design Session Feedback</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[48px] w-[274.328px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[349px]">Your system design session showed strong architectural thinking...</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_15_1245)" id="Icon">
          <path d="M3.5 5V11" id="Vector" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pd036b00} id="Vector_2" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_15_1245">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[52.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[52.234px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">1 day ago</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[72px] w-[274.328px]" data-name="Container">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[88px] left-[52px] top-0 w-[274.328px]" data-name="Container">
      <Heading6 />
      <Paragraph5 />
      <Paragraph6 />
      <Container15 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M9 6V3H6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3e254b00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 10.5H3" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15 10.5H16.5" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11.25 9.75V11.25" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 9.75V11.25" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <Icon6 />
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text5 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[88px] left-[16px] top-[16px] w-[326.328px]" data-name="Container">
      <Container16 />
      <PrimitiveSpan2 />
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container17 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-0 w-[128.25px]" data-name="Heading 4">
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">Minterviewer System</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 overflow-clip top-[24px] w-[274.328px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[14px]">Reminder: Scheduled Interview Today</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[16px] left-0 overflow-clip top-[48px] w-[274.328px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[342px]">You have a technical interview scheduled for today at 10:00 AM...</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_15_1215)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_15_1215">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[52.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[52.234px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">1 day ago</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[72px] w-[274.328px]" data-name="Container">
      <Icon7 />
      <Text6 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[88px] left-[52px] top-0 w-[274.328px]" data-name="Container">
      <Heading7 />
      <Paragraph7 />
      <Paragraph8 />
      <Container18 />
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">S</p>
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text7 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[88px] left-[16px] top-[16px] w-[326.328px]" data-name="Container">
      <Container19 />
      <PrimitiveSpan3 />
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container20 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[97.141px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start overflow-clip relative rounded-[inherit] w-[97.141px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">AI Coach Emma</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading8 />
      <Icon8 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[14px]">Behavioral Interview Tips</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[327px]">Here are some tips to improve your STAR method responses...</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_15_1210)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 8V6" id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 4H6.005" id="Vector_3" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_15_1210">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[57.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[57.328px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">2 days ago</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[88px] items-start left-[52px] top-0 w-[274.328px]" data-name="Container">
      <Container21 />
      <Paragraph9 />
      <Paragraph10 />
      <Container22 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M9 6V3H6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3e254b00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 10.5H3" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15 10.5H16.5" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M11.25 9.75V11.25" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 9.75V11.25" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[40px] items-center justify-center relative w-full">
        <Icon10 />
      </div>
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[40px] top-0" data-name="Primitive.span">
      <Text9 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[88px] left-[16px] top-[16px] w-[326.328px]" data-name="Container">
      <Container23 />
      <PrimitiveSpan4 />
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container24 />
    </div>
  );
}

function MessagesPage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[381.328px]" data-name="MessagesPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip pl-0 pr-[23px] py-0 relative rounded-[inherit] w-[381.328px]">
        <Button />
        <Button1 />
        <Button2 />
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[644px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <TabList />
      <MessagesPage />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0.08)] h-[715px] left-0 rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[383.328px]" data-name="Container">
      <div className="box-border content-stretch flex flex-col h-[715px] items-start overflow-clip p-px relative rounded-[inherit] w-[383.328px]">
        <Container5 />
        <PrimitiveDiv />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">AI Coach Sarah</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[14px]">2 hours ago</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[60px] top-0 w-[106.609px]" data-name="Container">
      <Heading3 />
      <Paragraph11 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 6.66667V3.33333H6.66667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p34a15680} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 11.6667H3.33333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 11.6667H18.3333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 10.8333V12.5" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 10.8333V12.5" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[48px] items-center justify-center relative w-full">
        <Icon11 />
      </div>
    </div>
  );
}

function PrimitiveSpan5() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[48px] top-0" data-name="Primitive.span">
      <Text10 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[48px] relative shrink-0 w-[166.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-[166.609px]">
        <Container26 />
        <PrimitiveSpan5 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3f214400} fill="var(--fill-0, #FFB900)" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[36px]">
        <Icon12 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p7ec0480} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36c0b900} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 8H9.33333" id="Vector_3" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[36px]">
        <Icon13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6.66667 7.33333V11.3333" id="Vector" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_2" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37e28100} id="Vector_3" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 4H14" id="Vector_4" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2ffbeb80} id="Vector_5" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="basis-0 grow h-[36px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[36px] items-center justify-center relative w-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[36px] relative shrink-0 w-[124px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center relative w-[124px]">
        <Button5 />
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[48px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Great Progress on Technical Interview!</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[rgba(251,44,54,0.2)] h-[22px] relative rounded-[8px] shrink-0 w-[42.344px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[42.344px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#ffa2a2] text-[12px] text-nowrap whitespace-pre">high</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(251,44,54,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[rgba(94,234,212,0.1)] h-[22px] relative rounded-[8px] shrink-0 w-[67.422px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[67.422px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#00d5be] text-[12px] text-nowrap whitespace-pre">feedback</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[8px] h-[22px] items-center relative shrink-0 w-full" data-name="Container">
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[167px] relative shrink-0 w-[788.672px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[16px] h-[167px] items-start pb-px pt-[24px] px-[24px] relative w-[788.672px]">
        <Container29 />
        <Heading2 />
        <Container30 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[468px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[26px] left-0 not-italic text-[#d1d5dc] text-[16px] top-[-2px] w-[661px]">
        <p className="mb-0">Hi Yamamah,</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Congratulations on your recent technical interview performance! You scored 9.2/10, which is a significant improvement from your previous sessions.</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Key Strengths:</p>
        <p className="mb-0">• Excellent problem-solving approach</p>
        <p className="mb-0">• Clear communication of your thought process</p>
        <p className="mb-0">• Strong understanding of data structures</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Areas for Growth:</p>
        <p className="mb-0">• Consider optimizing time complexity further</p>
        <p className="mb-0">• Practice edge case identification</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Keep up the great work!</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Best regards,</p>
        <p>AI Coach Sarah</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[788.672px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip pb-0 pl-[24px] pr-[47px] relative rounded-[inherit] w-[788.672px]">
        <Container32 />
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[100px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[100px] items-start px-[12px] py-[8px] relative w-full">
          <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Type your reply...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[36px] relative rounded-[8px] shrink-0 w-[75.859px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[17px] py-[9px] relative w-[75.859px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Cancel</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_15_1206)" id="Icon">
          <path d={svgPaths.p22f0380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.5693 1.43133L7.276 8.724" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_15_1206">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-gradient-to-r from-[#00bba7] h-[36px] relative rounded-[8px] shrink-0 to-[#00bc7d] w-[126.516px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[126.516px]">
        <Icon15 />
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[44px] not-italic text-[14px] text-nowrap text-white top-[6px] whitespace-pre">Send Reply</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-start justify-end relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[197px] relative shrink-0 w-[788.672px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-[197px] items-start pb-0 pt-[25px] px-[24px] relative w-[788.672px]">
        <Textarea />
        <Container34 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col h-[700px] items-start relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container33 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0.08)] h-[715px] left-[407.33px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[790.672px]" data-name="Container">
      <div className="box-border content-stretch flex flex-col h-[715px] items-start overflow-clip p-px relative rounded-[inherit] w-[790.672px]">
        <Container36 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[715px] relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container37 />
    </div>
  );
}

export default function MessagesPage1() {
  return (
    <div className="bg-gradient-to-b from-[#0a0f1e] relative size-full to-[#000000]" data-name="MessagesPage">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-0 pt-[32px] px-[32px] relative size-full">
          <Container3 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}