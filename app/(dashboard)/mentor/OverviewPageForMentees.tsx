import svgPaths from "./svg-ney1dopwpi";

function Heading1() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[1198px]" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-[-2px] whitespace-pre">Dashboard Overview 🎯</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-0 top-[44px] w-[1198px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-[-2px] whitespace-pre">Your interview preparation journey at a glance</p>
    </div>
  );
}

function Container() {
  return <div className="absolute bg-gradient-to-b from-[#5eead4] h-[4px] left-0 rounded-[3.35544e+07px] shadow-[0px_0px_10px_0px_rgba(94,234,212,0.5)] to-[rgba(0,0,0,0)] top-[84px] w-[200px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="h-[88px] relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Paragraph />
      <Container />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p98c0680} id="Vector" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[rgba(0,187,167,0.2)] box-border content-stretch flex items-center justify-center left-[25px] p-px rounded-[10px] size-[48px] top-[25px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[25px] top-[89px] w-[237.5px]" data-name="Heading 3">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Start AI Interview</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[25px] top-[117px] w-[237.5px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Practice with AI-powered mock interviews</p>
    </div>
  );
}

function Button() {
  return (
    <div className="[grid-area:1_/_1] bg-gradient-to-b from-[rgba(255,255,255,0.08)] relative rounded-[14px] shrink-0 to-[rgba(255,255,255,0.02)]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container2 />
      <Heading3 />
      <Paragraph1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 3V15" id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17 8L12 3L7 8" id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2d557600} id="Vector_3" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[rgba(0,188,125,0.2)] box-border content-stretch flex items-center justify-center left-[25px] p-px rounded-[10px] size-[48px] top-[25px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,125,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon1 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[25px] top-[89px] w-[237.5px]" data-name="Heading 3">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Upload CV for Review</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[25px] top-[117px] w-[237.5px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Get AI feedback on your resume</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="[grid-area:1_/_2] bg-gradient-to-b from-[rgba(255,255,255,0.08)] relative rounded-[14px] shrink-0 to-[rgba(255,255,255,0.02)]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,125,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container3 />
      <Heading5 />
      <Paragraph2 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1d820380} id="Vector" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p27451300} id="Vector_2" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2981fe00} id="Vector_3" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p161d4800} id="Vector_4" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[rgba(142,81,255,0.2)] box-border content-stretch flex items-center justify-center left-[25px] p-px rounded-[10px] size-[48px] top-[25px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(142,81,255,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon2 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[25px] top-[89px] w-[237.5px]" data-name="Heading 3">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Book Mentor Session</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[25px] top-[117px] w-[237.5px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Connect with industry experts</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="[grid-area:1_/_3] bg-gradient-to-b from-[rgba(255,255,255,0.08)] relative rounded-[14px] shrink-0 to-[rgba(255,255,255,0.02)]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(142,81,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container4 />
      <Heading6 />
      <Paragraph3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M8 2V6" id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 2V6" id="Vector_2" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p32f12c00} id="Vector_3" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 10H21" id="Vector_4" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[rgba(254,154,0,0.2)] box-border content-stretch flex items-center justify-center left-[25px] p-px rounded-[10px] size-[48px] top-[25px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(254,154,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon3 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[25px] top-[89px] w-[237.5px]" data-name="Heading 3">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Schedule Interview</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[25px] top-[117px] w-[237.5px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Book your next mock interview</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="[grid-area:1_/_4] bg-gradient-to-b from-[rgba(255,255,255,0.08)] relative rounded-[14px] shrink-0 to-[rgba(255,255,255,0.02)]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(254,154,0,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container5 />
      <Heading7 />
      <Paragraph4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[158px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p2ada2820} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p4cb2400} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#00d492] text-[12px] text-nowrap whitespace-pre">+12%</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[16px] relative shrink-0 w-[50.969px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[16px] items-center relative w-[50.969px]">
        <Icon5 />
        <Text />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Icon4 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">8.7/10</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Overall Score</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="[grid-area:1_/_1] relative rounded-[14px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative size-full">
          <Container8 />
          <Container9 />
          <Paragraph5 />
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p1fa66600} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p309e840} id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#00d492] text-[12px] text-nowrap whitespace-pre">+15</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[41.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[16px] items-center relative w-[41.156px]">
        <Icon7 />
        <Text1 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">127</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Total Interviews</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="[grid-area:1_/_2] relative rounded-[14px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative size-full">
          <Container12 />
          <Container13 />
          <Paragraph6 />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p221c4a00} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] overflow-clip relative rounded-[inherit] w-full">
        <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-[20.83%]" data-name="Vector">
          <div className="absolute inset-[-14.29%_-7.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 7">
              <path d={svgPaths.p3a7c9b80} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-[20.83%] left-1/2 right-1/2 top-[20.83%]" data-name="Vector">
          <div className="absolute inset-[-7.14%_-0.67px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
              <path d="M1 10.3333V1" id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[14.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[14.688px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#00d492] text-[12px] text-nowrap whitespace-pre">+3</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[34.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[16px] items-center relative w-[34.688px]">
        <Icon9 />
        <Text2 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">15 days</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Practice Streak</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="[grid-area:1_/_3] relative rounded-[14px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative size-full">
          <Container16 />
          <Container17 />
          <Paragraph7 />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d="M14 7V14L18.6667 16.3333" id="Vector" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p1fa66600} id="Vector_2" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p82fb540} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V3.33333" id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#00d492] text-[12px] text-nowrap whitespace-pre">+2.5h</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[16px] relative shrink-0 w-[50.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[16px] items-center relative w-[50.547px]">
        <Icon11 />
        <Text3 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Icon10 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">12.5h</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">This Week</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="[grid-area:1_/_4] relative rounded-[14px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-px pt-[25px] px-[25px] relative size-full">
          <Container20 />
          <Container21 />
          <Paragraph8 />
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[138px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container14 />
      <Container18 />
      <Container22 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3ac0b600} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c797180} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[171.984px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[171.984px]">
        <Icon12 />
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[28px] not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Weekly Performance</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[rgba(0,188,125,0.2)] h-[22px] relative rounded-[8px] shrink-0 w-[111.219px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[111.219px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#5ee9b5] text-[12px] text-nowrap whitespace-pre">+8% vs last week</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,125,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading8 />
      <Badge />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[2%_0.68%_14%_8.77%]" data-name="Group">
      <div className="absolute bottom-[-0.24%] left-0 right-0 top-[-0.24%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 671 212">
          <g id="Group">
            <path d="M0 211H671" id="Vector" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M0 158.5H671" id="Vector_2" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M0 106H671" id="Vector_3" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M0 53.5H671" id="Vector_4" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M0 1H671" id="Vector_5" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[2%_0.68%_14%_8.77%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.07%] right-[-0.07%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 673 210">
          <g id="Group">
            <path d="M1 0V210" id="Vector" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M112.833 0V210" id="Vector_2" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M224.667 0V210" id="Vector_3" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M336.5 0V210" id="Vector_4" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M448.333 0V210" id="Vector_5" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M560.167 0V210" id="Vector_6" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
            <path d="M672 0V210" id="Vector_7" stroke="var(--stroke-0, #5EEAD4)" strokeDasharray="3 3" strokeOpacity="0.1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[2%_0.68%_14%_8.77%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[86%_89.54%_6.19%_7.08%]" data-name="Group">
      <div className="absolute inset-[86%_91.23%_11.6%_8.77%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_89.54%_6.19%_7.08%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Mon</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[86%_74.72%_6.19%_22.45%]" data-name="Group">
      <div className="absolute inset-[86%_76.14%_11.6%_23.86%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_74.72%_6.19%_22.45%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Tue</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[86%_59.29%_6.19%_37.2%]" data-name="Group">
      <div className="absolute inset-[86%_61.04%_11.6%_38.96%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_59.29%_6.19%_37.2%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Wed</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[86%_44.47%_6.19%_52.56%]" data-name="Group">
      <div className="absolute inset-[86%_45.95%_11.6%_54.05%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_44.47%_6.19%_52.56%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Thu</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[86%_29.85%_6.19%_68.13%]" data-name="Group">
      <div className="absolute inset-[86%_30.86%_11.6%_69.14%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_29.85%_6.19%_68.13%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Fri</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[86%_14.48%_6.19%_82.95%]" data-name="Group">
      <div className="absolute inset-[86%_15.77%_11.6%_84.23%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_14.48%_6.19%_82.95%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Sat</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[86%_-0.14%_6.19%_97.17%]" data-name="Group">
      <div className="absolute inset-[86%_0.68%_11.6%_99.33%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 6V0" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[87.81%_-0.14%_6.19%_97.17%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">Sun</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[86%_-0.14%_6.19%_7.08%]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[86%_-0.14%_6.19%_7.08%]" data-name="Group">
      <div className="absolute inset-[86%_0.68%_14%_8.77%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 671 2">
            <path d="M0 1H671" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[82.9%_91.23%_11.1%_6.75%]" data-name="Group">
      <div className="absolute inset-[86%_91.23%_14%_7.96%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
            <path d="M0 1H6" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[82.9%_92.31%_11.1%_6.75%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-nowrap text-right whitespace-pre">7</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[61.9%_91.23%_32.1%_4.59%]" data-name="Group">
      <div className="absolute inset-[65%_91.23%_35%_7.96%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
            <path d="M0 1H6" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[61.9%_92.31%_32.1%_4.59%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-nowrap text-right whitespace-pre">7.75</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[40.9%_91.23%_53.1%_5.26%]" data-name="Group">
      <div className="absolute inset-[44%_91.23%_56%_7.96%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
            <path d="M0 1H6" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[40.9%_92.31%_53.1%_5.26%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-nowrap text-right whitespace-pre">8.5</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[19.9%_91.23%_74.1%_4.18%]" data-name="Group">
      <div className="absolute inset-[23%_91.23%_77%_7.96%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
            <path d="M0 1H6" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[19.9%_92.31%_74.1%_4.18%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-nowrap text-right whitespace-pre">9.25</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[0.5%_91.23%_93.5%_5.8%]" data-name="Group">
      <div className="absolute inset-[2%_91.23%_98%_7.96%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 2">
            <path d="M0 1H6" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[0.5%_92.31%_93.5%_5.8%] leading-[normal] not-italic text-[#99a1af] text-[12px] text-nowrap text-right whitespace-pre">10</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[0.5%_91.23%_11.1%_4.18%]" data-name="Group">
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[0.5%_91.23%_11.1%_4.18%]" data-name="Group">
      <div className="absolute inset-[2%_91.23%_14%_8.77%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 210">
            <path d="M1 0V210" id="Vector" stroke="var(--stroke-0, #99A1AF)" />
          </svg>
        </div>
      </div>
      <Group17 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute inset-[30%_0.68%_14%_8.77%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.04%] right-[-0.04%] top-[-0.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 673 141">
          <g id="Group">
            <path d={svgPaths.pb8ac700} fill="url(#paint0_linear_14_792)" id="recharts-area-:r9a:" />
            <path d={svgPaths.p722c300} id="Vector" stroke="var(--stroke-0, #5EEAD4)" strokeWidth="2" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_14_792" x1="1" x2="1" y1="1" y2="141">
              <stop offset="0.05" stopColor="#5EEAD4" stopOpacity="0.3" />
              <stop offset="0.95" stopColor="#5EEAD4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[30%_0.68%_14%_8.77%]" data-name="Group">
      <Group19 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute h-[250px] left-0 overflow-clip top-0 w-[741px]" data-name="Icon">
      <Group2 />
      <Group11 />
      <Group18 />
      <Group20 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[250px] relative shrink-0 w-full" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(255,255,255,0.08)] gap-[24px] h-[358px] items-start left-0 pb-px pt-[25px] px-[25px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[790.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container24 />
      <Container25 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon14 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[28px] not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Quick Actions</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p24bc3d00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e238c80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[101.047px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[101.047px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Start Interview</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-gradient-to-r from-[#00bba7] h-[56px] relative rounded-[10px] shrink-0 to-[#00bc7d] w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <Icon15 />
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p19e4f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p8586900} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[110.547px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[110.547px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Practice Coding</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-gradient-to-r from-[#8e51ff] h-[56px] relative rounded-[10px] shrink-0 to-[#ad46ff] w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <Icon16 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p12dcd500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[120.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[120.188px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Review Feedback</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-gradient-to-r from-[#fe9a00] h-[56px] relative rounded-[10px] shrink-0 to-[#ff6900] w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <Icon17 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[111.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[111.094px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Check Schedule</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-gradient-to-r from-[#ff2056] h-[56px] relative rounded-[10px] shrink-0 to-[#f6339a] w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center pl-[16px] pr-0 py-0 relative w-full">
          <Icon18 />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[260px] items-start relative shrink-0 w-full" data-name="Container">
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(255,255,255,0.08)] gap-[24px] h-[358px] items-start left-[814.66px] pb-px pt-[25px] px-[25px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[383.344px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading9 />
      <Container27 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[358px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container28 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon19 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[28px] not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Upcoming Today</p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[24px] left-[17px] top-[17px] w-[299.328px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Technical Interview</p>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_14_740)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_14_740">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[87.297px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[87.297px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Today, 10:00 AM</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-[17px] top-[49px] w-[299.328px]" data-name="Container">
      <Icon20 />
      <Text8 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(0,187,167,0.2)] h-[22px] left-[17px] rounded-[8px] top-[75px] w-[55.438px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[55.438px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#46ecd5] text-[12px] text-nowrap whitespace-pre">60 min</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[114px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Heading4 />
      <Container30 />
      <Badge1 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="absolute h-[24px] left-[17px] top-[17px] w-[299.328px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">System Design</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_14_740)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_14_740">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[79.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[79.813px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Today, 2:00 PM</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-[17px] top-[49px] w-[299.328px]" data-name="Container">
      <Icon21 />
      <Text9 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(0,187,167,0.2)] h-[22px] left-[17px] rounded-[8px] top-[75px] w-[55.438px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[55.438px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#46ecd5] text-[12px] text-nowrap whitespace-pre">90 min</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[114px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Heading11 />
      <Container32 />
      <Badge2 />
    </div>
  );
}

function Heading12() {
  return (
    <div className="absolute h-[24px] left-[17px] top-[17px] w-[299.328px]" data-name="Heading 4">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Behavioral Prep</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_14_740)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_14_740">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[109.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[109.734px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Tomorrow, 11:00 AM</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-[17px] top-[49px] w-[299.328px]" data-name="Container">
      <Icon22 />
      <Text10 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[rgba(0,187,167,0.2)] h-[22px] left-[17px] rounded-[8px] top-[75px] w-[55.641px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[55.641px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#46ecd5] text-[12px] text-nowrap whitespace-pre">45 min</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,187,167,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[114px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Heading12 />
      <Container34 />
      <Badge3 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[366px] items-start relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container33 />
      <Container35 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[rgba(94,234,212,0.2)] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[110.38px] not-italic text-[#46ecd5] text-[14px] text-nowrap top-[6px] whitespace-pre">View All Schedule</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(255,255,255,0.08)] gap-[24px] h-[516px] items-start left-0 pb-px pt-[25px] px-[25px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[383.328px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading10 />
      <Container36 />
      <Button8 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_14_735)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240d7000} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_14_735">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon23 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[28px] not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Current Goals</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[204.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[204.578px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">Complete 50 Technical Interviews</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[22.766px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#46ecd5] text-[12px] top-[-1px] w-[23px]">84%</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Container39() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[53.333px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container39 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[38px]">42 / 50</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Container38 />
      <PrimitiveDiv />
      <Paragraph9 />
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[162.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[162.438px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">Achieve 9.0 Average Score</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[22.766px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#46ecd5] text-[12px] top-[-1px] w-[23px]">72%</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text13 />
      <Text14 />
    </div>
  );
}

function Container42() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv1() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[93.332px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container42 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[34px]">8.7 / 9</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Container41 />
      <PrimitiveDiv1 />
      <Paragraph10 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[138.312px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[138.312px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#d1d5dc] text-[14px] text-nowrap whitespace-pre">30-Day Practice Streak</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-[22.766px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#46ecd5] text-[12px] top-[-1px] w-[23px]">50%</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Container45() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv2() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[166.664px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container45 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-[-1px] w-[38px]">15 / 30</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <PrimitiveDiv2 />
      <Paragraph11 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[200px] items-start relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container43 />
      <Container46 />
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[rgba(94,234,212,0.2)] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[121.45px] not-italic text-[#46ecd5] text-[14px] text-nowrap top-[6px] whitespace-pre">Manage Goals</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(255,255,255,0.08)] gap-[24px] h-[516px] items-start left-[407.33px] pb-px pt-[25px] px-[25px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[383.328px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading13 />
      <Container47 />
      <Button9 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p164f7540} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon24 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[28px] not-italic text-[16px] text-nowrap text-white top-[-2px] whitespace-pre">Recent Achievements</p>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_14_817)" id="Icon">
          <path d={svgPaths.p3ace1680} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p105cfc80} id="Vector_2" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p312978e0} id="Vector_3" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 18.3333H16.6667" id="Vector_4" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1356a280} id="Vector_5" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18544000} id="Vector_6" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_14_817">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="bg-gradient-to-b from-[rgba(94,234,212,0.2)] relative rounded-[3.35544e+07px] shrink-0 size-[40px] to-[rgba(52,211,153,0.1)]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon25 />
      </div>
    </div>
  );
}

function Heading15() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Interview Master</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#6a7282] text-[12px]">2 days ago</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[40px] items-start relative w-full">
        <Heading15 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container49 />
      <Container50 />
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[74px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[74px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} id="Vector" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-gradient-to-b from-[rgba(94,234,212,0.2)] relative rounded-[3.35544e+07px] shrink-0 size-[40px] to-[rgba(52,211,153,0.1)]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon26 />
      </div>
    </div>
  );
}

function Heading16() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Top Performer</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#6a7282] text-[12px]">5 days ago</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[40px] items-start relative w-full">
        <Heading16 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[74px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[74px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3a2fa580} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="bg-gradient-to-b from-[rgba(94,234,212,0.2)] relative rounded-[3.35544e+07px] shrink-0 size-[40px] to-[rgba(52,211,153,0.1)]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon27 />
      </div>
    </div>
  );
}

function Heading17() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 4">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Streak Champion</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#6a7282] text-[12px]">1 week ago</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="basis-0 grow h-[40px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[40px] items-start relative w-full">
        <Heading17 />
        <Paragraph14 />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container57 />
      <Container58 />
    </div>
  );
}

function Container60() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[74px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[74px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[246px] items-start relative shrink-0 w-full" data-name="Container">
      <Container52 />
      <Container56 />
      <Container60 />
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[rgba(94,234,212,0.2)] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[94.75px] not-italic text-[#46ecd5] text-[14px] text-nowrap top-[6px] whitespace-pre">View All Achievements</p>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(255,255,255,0.08)] gap-[24px] h-[516px] items-start left-[814.66px] pb-px pt-[25px] px-[25px] rounded-[14px] to-[rgba(255,255,255,0.02)] top-0 w-[383.344px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading14 />
      <Container61 />
      <Button10 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[516px] relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container48 />
      <Container62 />
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="bg-gradient-to-b from-[#0a0f1e] h-[1450px] relative shrink-0 to-[#000000] w-full" data-name="OverviewPage">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[1450px] items-start pb-0 pt-[32px] px-[32px] relative w-full">
          <Container1 />
          <Container6 />
          <Container23 />
          <Container29 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[#0a0f1e] h-[1695px] items-start left-0 pl-[280px] pr-0 py-0 to-[#000000] top-0 w-[1542px]" data-name="App">
      <OverviewPage />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[47.984px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[18px] left-0 not-italic text-[12px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">Technical</p>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[28px] relative shrink-0 w-[27.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[28px] items-start relative w-[27.469px]">
        <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[20px] text-neutral-950">🎯</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative rounded-[3.35544e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Text18 />
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

function Paragraph15() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Your AI Career Coach</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[40px] relative shrink-0 w-[111.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[40px] items-start relative w-[111.703px]">
        <Heading2 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Container64 />
      <Container65 />
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[97px] items-start left-0 pb-px pt-[24px] px-[24px] top-0 w-[256px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
      <Container66 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[38px] left-0 rounded-[10px] top-0 w-[224px]" data-name="Text Input">
      <div className="box-border content-stretch flex h-[38px] items-center overflow-clip pl-[40px] pr-[16px] py-[8px] relative rounded-[inherit] w-[224px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6a7282] text-[14px] text-nowrap whitespace-pre">Search...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[113px] w-[224px]" data-name="Container">
      <TextInput />
      <Icon28 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pb56cd00} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3295c000} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text19() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#46ecd5] text-[14px] text-nowrap whitespace-pre">Overview</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[86.984px]">
        <Icon29 />
        <Text19 />
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[rgba(94,234,212,0.15)] h-[44px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(94,234,212,0.1)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[121.016px] py-0 relative w-full">
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p14dca900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p117fc1f0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">My Profile</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[20px] relative shrink-0 w-[92.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[92.578px]">
        <Icon30 />
        <Text20 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[115.422px] py-0 relative w-full">
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_14_776)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29e1f300} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29ba0200} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_14_776">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Interview Practice</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[20px] relative shrink-0 w-[138.172px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[138.172px]">
        <Icon31 />
        <Text21 />
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[69.828px] py-0 relative w-full">
          <Container71 />
        </div>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a382d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p678c080} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 6.75H6" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 9.75H6" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 12.75H6" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text22() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">CV Review</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[20px] relative shrink-0 w-[94.031px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[94.031px]">
        <Icon32 />
        <Text22 />
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[113.969px] py-0 relative w-full">
          <Container72 />
        </div>
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p14dca900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p117fc1f0} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text23() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Mentors</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[20px] relative shrink-0 w-[81.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[81.578px]">
        <Icon33 />
        <Text23 />
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[126.422px] py-0 relative w-full">
          <Container73 />
        </div>
      </div>
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M6 1.5V4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 1.5V4.5" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p13693a10} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M2.25 7.5H15.75" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text24() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Schedule</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.031px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[86.031px]">
        <Icon34 />
        <Text24 />
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[121.969px] py-0 relative w-full">
          <Container74 />
        </div>
      </div>
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M12 5.25H16.5V9.75" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p305bd600} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text25() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Performance</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[20px] relative shrink-0 w-[107.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[107.859px]">
        <Icon35 />
        <Text25 />
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[100.141px] py-0 relative w-full">
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2e6f6a00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p23bfda80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Achievements</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[20px] relative shrink-0 w-[116.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[116.156px]">
        <Icon36 />
        <Text26 />
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[91.844px] py-0 relative w-full">
          <Container76 />
        </div>
      </div>
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1bb47df0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text27() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Messages</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[20px] relative shrink-0 w-[90.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[90.406px]">
        <Icon37 />
        <Text27 />
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="bg-[#00bba7] h-[20px] relative rounded-[3.35544e+07px] shrink-0 w-[22.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start px-[8px] py-[2px] relative w-[22.469px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between px-[16px] py-0 relative w-full">
          <Container77 />
          <Text28 />
        </div>
      </div>
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_14_776)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29e1f300} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29ba0200} id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_14_776">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text29() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Goals</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[20px] relative shrink-0 w-[64.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[64.266px]">
        <Icon38 />
        <Text29 />
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[143.734px] py-0 relative w-full">
          <Container78 />
        </div>
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a382d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p678c080} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 6.75H6" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 9.75H6" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 12.75H6" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text30() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Reports</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[20px] relative shrink-0 w-[77.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[77.281px]">
        <Icon39 />
        <Text30 />
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[130.719px] py-0 relative w-full">
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2802f40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text31() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Settings</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[20px] relative shrink-0 w-[79.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[20px] items-center relative w-[79.75px]">
        <Icon40 />
        <Text31 />
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[44px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[44px] items-center justify-between pl-[16px] pr-[128.25px] py-0 relative w-full">
          <Container80 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[4px] h-[604px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[167px] w-[256px]" data-name="Navigation">
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_14_763)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_14_763">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading18() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon41 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-[24px] not-italic text-[14px] text-nowrap text-white top-[-2px] whitespace-pre">Recent Activity</p>
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_14_682)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24f94f00} id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_14_682">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container81() {
  return (
    <div className="bg-[rgba(0,188,125,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon42 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[19.5px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[19.5px] left-0 not-italic text-[12px] text-white top-[-2px] w-[162px]">Completed Technical Interview</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex h-[16px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',_sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[12px]">Score: 9.2/10</p>
    </div>
  );
}

function Icon43() {
  return (
    <div className="absolute left-0 size-[10px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_14_674)" id="Icon">
          <path d="M5 2.5V5L6.66667 5.83333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3cf7650} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_14_674">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon43 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[14px] not-italic text-[#6a7282] text-[12px] text-nowrap top-[-1px] whitespace-pre">2 hours ago</p>
    </div>
  );
}

function Container82() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2px] h-[59.5px] items-start relative w-full">
        <Paragraph16 />
        <Paragraph17 />
        <Paragraph18 />
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container81 />
      <Container82 />
    </div>
  );
}

function Container84() {
  return (
    <div className="bg-gradient-to-b from-[rgba(255,255,255,0.06)] h-[85.5px] relative rounded-[10px] shrink-0 to-[rgba(255,255,255,0.02)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[85.5px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p27aad680} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p11188400} id="Vector_2" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container85() {
  return (
    <div className="bg-[rgba(254,154,0,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon44 />
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[19.5px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[19.5px] left-0 not-italic text-[12px] text-nowrap text-white top-[-2px] whitespace-pre">Achievement Unlocked</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-[-1px] w-[169px]">Interview Master - 50 Interviews</p>
    </div>
  );
}

function Icon45() {
  return (
    <div className="absolute left-0 size-[10px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_14_674)" id="Icon">
          <path d="M5 2.5V5L6.66667 5.83333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3cf7650} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_14_674">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon45 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[14px] not-italic text-[#6a7282] text-[12px] text-nowrap top-[-1px] whitespace-pre">5 hours ago</p>
    </div>
  );
}

function Container86() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2px] h-[59.5px] items-start relative w-full">
        <Paragraph19 />
        <Paragraph20 />
        <Paragraph21 />
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container85 />
      <Container86 />
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-gradient-to-b from-[rgba(255,255,255,0.06)] h-[85.5px] relative rounded-[10px] shrink-0 to-[rgba(255,255,255,0.02)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[85.5px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container87 />
        </div>
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_14_663)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1426c1f0} id="Vector_2" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p206e4880} id="Vector_3" stroke="var(--stroke-0, #A684FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_14_663">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container89() {
  return (
    <div className="bg-[rgba(142,81,255,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon46 />
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[19.5px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[19.5px] left-0 not-italic text-[12px] text-nowrap text-white top-[-2px] whitespace-pre">Goal Progress Updated</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-[-1px] w-[159px]">System Design: 75% complete</p>
    </div>
  );
}

function Icon47() {
  return (
    <div className="absolute left-0 size-[10px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_14_674)" id="Icon">
          <path d="M5 2.5V5L6.66667 5.83333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3cf7650} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_14_674">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon47 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[14px] not-italic text-[#6a7282] text-[12px] text-nowrap top-[-1px] whitespace-pre">8 hours ago</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2px] h-[59.5px] items-start relative w-full">
        <Paragraph22 />
        <Paragraph23 />
        <Paragraph24 />
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container89 />
      <Container90 />
    </div>
  );
}

function Container92() {
  return (
    <div className="bg-gradient-to-b from-[rgba(255,255,255,0.06)] h-[85.5px] relative rounded-[10px] shrink-0 to-[rgba(255,255,255,0.02)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[85.5px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function Icon48() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2a5a140} id="Vector" stroke="var(--stroke-0, #51A2FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container93() {
  return (
    <div className="bg-[rgba(43,127,255,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon48 />
      </div>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[19.5px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[19.5px] left-0 not-italic text-[12px] text-white top-[-2px] w-[153px]">New Message from AI Coach</p>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-[-1px] w-[167px]">Review your latest performance</p>
    </div>
  );
}

function Icon49() {
  return (
    <div className="absolute left-0 size-[10px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_14_674)" id="Icon">
          <path d="M5 2.5V5L6.66667 5.83333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3cf7650} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_14_674">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon49 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[14px] not-italic text-[#6a7282] text-[12px] text-nowrap top-[-1px] whitespace-pre">1 day ago</p>
    </div>
  );
}

function Container94() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2px] h-[59.5px] items-start relative w-full">
        <Paragraph25 />
        <Paragraph26 />
        <Paragraph27 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container93 />
      <Container94 />
    </div>
  );
}

function Container96() {
  return (
    <div className="bg-gradient-to-b from-[rgba(255,255,255,0.06)] h-[85.5px] relative rounded-[10px] shrink-0 to-[rgba(255,255,255,0.02)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[85.5px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container95 />
        </div>
      </div>
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #00D5BE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container97() {
  return (
    <div className="bg-[rgba(0,187,167,0.2)] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon50 />
      </div>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="h-[19.5px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[19.5px] left-0 not-italic text-[12px] text-nowrap text-white top-[-2px] whitespace-pre">Report Generated</p>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] top-[-1px] w-[153px]">Monthly Performance Report</p>
    </div>
  );
}

function Icon51() {
  return (
    <div className="absolute left-0 size-[10px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_14_674)" id="Icon">
          <path d="M5 2.5V5L6.66667 5.83333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d={svgPaths.p3cf7650} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_14_674">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <Icon51 />
      <p className="absolute font-['Arial:Regular',_sans-serif] leading-[16px] left-[14px] not-italic text-[#6a7282] text-[12px] text-nowrap top-[-1px] whitespace-pre">2 days ago</p>
    </div>
  );
}

function Container98() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[2px] h-[59.5px] items-start relative w-full">
        <Paragraph28 />
        <Paragraph29 />
        <Paragraph30 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Container100() {
  return (
    <div className="bg-gradient-to-b from-[rgba(255,255,255,0.06)] h-[85.5px] relative rounded-[10px] shrink-0 to-[rgba(255,255,255,0.02)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[85.5px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container99 />
        </div>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="h-[300px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[300px] items-start pb-0 pl-0 pr-[8px] relative w-full">
          <Container84 />
          <Container88 />
          <Container92 />
          <Container96 />
          <Container100 />
        </div>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[12px] h-[364px] items-start left-0 pb-0 pt-[16px] px-[16px] top-[795px] w-[256px]" data-name="Container">
      <Heading18 />
      <Container101 />
    </div>
  );
}

function Heading19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[62.563px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[62.563px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">This Week</p>
      </div>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #46ECD5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container103() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading19 />
      <Icon52 />
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[16px] relative shrink-0 w-[53.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[53.203px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Interviews</p>
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[24px] relative shrink-0 w-[17.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[17.25px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#46ecd5] text-[16px] text-nowrap top-[-2px] whitespace-pre">12</p>
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text32 />
      <Text33 />
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[16px] relative shrink-0 w-[59.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[59.656px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Time Spent</p>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29.781px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[29.781px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#00d492] text-[16px] text-nowrap top-[-2px] whitespace-pre">8.5h</p>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text34 />
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="h-[16px] relative shrink-0 w-[53.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-start relative w-[53.016px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-nowrap whitespace-pre">Avg Score</p>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[24px] relative shrink-0 w-[44.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[44.203px]">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-0 not-italic text-[#46ecd5] text-[16px] text-nowrap top-[-2px] whitespace-pre">8.7/10</p>
      </div>
    </div>
  );
}

function Container106() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text36 />
      <Text37 />
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[88px] items-start relative shrink-0 w-full" data-name="Container">
      <Container104 />
      <Container105 />
      <Container106 />
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(94,234,212,0.1)] gap-[12px] h-[154px] items-start left-[16px] pb-px pt-[17px] px-[17px] rounded-[10px] to-[rgba(52,211,153,0.1)] top-[1191px] w-[224px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container103 />
      <Container107 />
    </div>
  );
}

function Icon53() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text38() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">Notifications</p>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="h-[20px] relative shrink-0 w-[102.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[102.375px]">
        <Icon53 />
        <Text38 />
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="bg-[#00bba7] h-[20px] relative rounded-[3.35544e+07px] shrink-0 w-[22.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start px-[8px] py-[2px] relative w-[22.469px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex h-[46px] items-center justify-between left-[16px] px-[13px] py-px rounded-[10px] top-[1393px] w-[224px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container109 />
      <Text39 />
    </div>
  );
}

function Text40() {
  return (
    <div className="h-[20px] relative shrink-0 w-[97.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[97.406px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-nowrap whitespace-pre">{`Help & Support`}</p>
      </div>
    </div>
  );
}

function Icon54() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex h-[46px] items-center justify-between left-[16px] px-[13px] py-px rounded-[10px] top-[1471px] w-[224px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Text40 />
      <Icon54 />
    </div>
  );
}

function Icon55() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2c1f680} id="Vector" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 8H6" id="Vector_2" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p12257fa0} id="Vector_3" stroke="var(--stroke-0, #FF6467)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text41() {
  return (
    <div className="h-[20px] relative shrink-0 w-[43.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[43.922px]">
        <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#ff6467] text-[14px] text-nowrap whitespace-pre">Logout</p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute bg-[rgba(220,38,38,0.1)] box-border content-stretch flex gap-[8px] h-[46px] items-center left-[16px] pl-[13px] pr-px py-px rounded-[10px] top-[1549px] w-[224px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(220,38,38,0.2)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon55 />
      <Text41 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0f172b] h-[1695px] left-0 to-[#0a0f1e] top-0 w-[280px]" data-name="Sidebar">
      <div className="h-[1695px] overflow-clip relative rounded-[inherit] w-[280px]">
        <Container67 />
        <Container68 />
        <Navigation />
        <Container102 />
        <Container108 />
        <Button23 />
        <Button24 />
        <Button25 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(94,234,212,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function OverviewPageForMentees() {
  return (
    <div className="bg-white relative size-full" data-name="Overview page for Mentees">
      <App />
      <Text17 />
      <Sidebar />
    </div>
  );
}