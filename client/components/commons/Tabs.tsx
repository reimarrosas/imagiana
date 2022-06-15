import { ReactNode, useState } from "react";

interface Props {
  tablist: Record<string, ReactNode>;
  sectionClass?: string;
  tabClass?: string;
  btnClass?: string;
  btnSelectedClass?: string;
  tabContentClass?: string;
}

const Tabs = ({
  tablist,
  sectionClass,
  tabClass,
  btnClass,
  btnSelectedClass,
  tabContentClass,
}: Props) => {
  const [tabSelected, setTabSelected] = useState(Object.keys(tablist)[0]);
  return (
    <section title="Authentication Form Tabs" className={sectionClass}>
      <div className={tabClass}>
        {Object.keys(tablist).map((btn, ind) => (
          <button
            key={ind}
            className={`${
              btn === tabSelected ? btnSelectedClass : ""
            } ${btnClass}`}
            onClick={(_) => setTabSelected(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      <div className={tabContentClass}>{tablist[tabSelected]}</div>
    </section>
  );
};

export default Tabs;
