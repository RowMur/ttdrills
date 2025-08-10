import { DiagramSection } from "@/app/drills/[drill]/_components/DiagramSection";
import { DrillDetails } from "@/components/DrillDetails";
import { DeleteDrillButton } from "@/components/DeleteDrillButton";
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
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-center sm:text-left">
          {drill.name}
        </h2>
        <DeleteDrillButton
          drillSlug={drill.slug}
          drillName={drill.name}
          creatorEmail={drill.creator?.email || ""}
        />
      </div>
      <DrillDetails drill={drill} />
      <DiagramSection drill={drill} />
    </Main>
  );
};

export default Page;
