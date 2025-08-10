import { DiagramSection } from "@/app/drills/[drill]/_components/DiagramSection";
import { DrillDetails } from "@/components/DrillDetails";
import { Main } from "@/components/Main";
import { notFound } from "next/navigation";
import { getDrillBySlug, transformDatabaseDrill } from "@/lib/database";

type Props = {
  params: Promise<{
    drill: string;
  }>;
};

const Page = async (props: Props) => {
  const params = await props.params;

  const dbDrill = await getDrillBySlug(params.drill);

  if (!dbDrill) {
    notFound();
  }

  // Transform database result to match Drill type
  const drill = transformDatabaseDrill(dbDrill);

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
