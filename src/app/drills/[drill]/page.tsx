import { DiagramSection } from "@/app/drills/[drill]/_components/DiagramSection";
import { DrillDetails } from "@/components/DrillDetails";
import { DeleteDrillButton } from "@/components/DeleteDrillButton";
import { EditDrillButton } from "@/components/EditDrillButton";
import { TimerButton } from "@/components/TimerButton";
import { ShareButton } from "@/components/ShareButton";
import { DrillViewTracker } from "@/components/DrillViewTracker";
import { Main } from "@/components/Main";
import { notFound } from "next/navigation";
import { getDrillBySlug, transformDatabaseDrill } from "@/lib/database";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    drill: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { drill: slug } = await params;
  const dbDrill = await getDrillBySlug(slug);

  if (!dbDrill) {
    return {
      title: "Drill Not Found - TTDrills",
      description: "The requested table tennis drill could not be found.",
    };
  }

  const drill = transformDatabaseDrill(dbDrill);

  return {
    title: drill.name,
    description:
      drill.description ||
      `Practice the ${drill.name} table tennis drill with interactive diagrams and step-by-step instructions. Perfect for ${drill.difficulty} level players.`,
    keywords: [
      drill.name,
      "table tennis drill",
      `${drill.difficulty} level`,
      ...drill.categories,
      "ping pong training",
      "table tennis practice",
      "interactive drill",
    ],
    openGraph: {
      title: `${drill.name} - TTDrills`,
      description:
        drill.description ||
        `Practice the ${drill.name} table tennis drill with interactive diagrams and step-by-step instructions.`,
      type: "website",
      url: `https://ttdrills.com/drills/${drill.slug}`,
      ...(drill.videoUrl && {
        images: [
          {
            url: `https://img.youtube.com/vi/${
              drill.videoUrl.split("v=")[1]
            }/maxresdefault.jpg`,
            width: 1200,
            height: 630,
            alt: `${drill.name} drill demonstration`,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${drill.name} - TTDrills`,
      description:
        drill.description ||
        `Practice the ${drill.name} table tennis drill with interactive diagrams and step-by-step instructions.`,
      ...(drill.videoUrl && {
        images: [
          `https://img.youtube.com/vi/${
            drill.videoUrl.split("v=")[1]
          }/maxresdefault.jpg`,
        ],
      }),
    },
    alternates: {
      canonical: `/drills/${drill.slug}`,
    },
  };
}

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
      <DrillViewTracker drill={drill} />
      <div className="flex justify-between flex-wrap gap-2 items-start mb-4">
        <h2 className="text-2xl font-bold text-left">{drill.name}</h2>
        <div className="flex justify-center sm:justify-start gap-2 sm:grow-0">
          <TimerButton />
          <ShareButton drillSlug={drill.slug} />
          <EditDrillButton
            drillSlug={drill.slug}
            creatorEmail={drill.creator?.email || ""}
          />
          <DeleteDrillButton
            drillSlug={drill.slug}
            drillName={drill.name}
            creatorEmail={drill.creator?.email || ""}
          />
        </div>
      </div>
      <DrillDetails drill={drill} />
      <DiagramSection drill={drill} />
    </Main>
  );
};

export default Page;
