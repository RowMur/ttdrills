import { DiagramSection } from "@/app/drills/[drill]/_components/DiagramSection";
import { DrillDetails } from "@/components/DrillDetails";
import { Main } from "@/components/Main";
import { DRILLS } from "@/data";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    drill: string;
  }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const drill = DRILLS.find((d) => d.slug === params.drill);

  if (!drill) {
    notFound();
  }

  return (
    <Main>
      <h2 className="text-2xl font-bold text-center sm:text-left mb-4">
        {drill.name}
      </h2>
      <DrillDetails drill={drill} />
      <DiagramSection drill={drill} />
    </Main>
  );
};

export default Page;
