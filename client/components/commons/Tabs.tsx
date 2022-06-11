import { ReactNode, useState } from "react";

interface Props {
  tablist: Record<string, ReactNode>;
  tabClass?: string;
  btnClass?: string;
}

const Tabs = ({ tablist, tabClass, btnClass }: Props) => {
  const [tabSelected, setTabSelected] = useState(Object.keys(tablist)[0]);
  return (
    <section title="Authentication Forms">
      <div className={tabClass}>
        {Object.keys(tablist).map((btn, ind) => (
          <button
            key={ind}
            className={btnClass}
            onClick={(_) => setTabSelected(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      {tablist[tabSelected]}
    </section>
  );
};

export default Tabs;
