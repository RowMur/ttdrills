import { notFound, redirect } from "next/navigation";
import { getDrillBySlug, transformDatabaseDrill } from "@/lib/database";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { EditDrillForm } from "@/components/EditDrillForm";

type Props = {
  params: Promise<{
    drill: string;
  }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get the drill
  const dbDrill = await getDrillBySlug(params.drill);

  if (!dbDrill) {
    notFound();
  }

  // Transform database result to match Drill type
  const drill = transformDatabaseDrill(dbDrill);

  // Get user from database
  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/auth/signin");
  }

  // Check if user owns the drill
  if (drill.creatorId !== user.id) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-text">
          Edit Drill Details: {drill.name}
        </h1>
        <p className="text-center text-text-subtle mb-8">
          You can edit the description, objectives, tips, duration, and video
          information. The drill structure (name, difficulty, categories, and
          ball sequence) cannot be changed.
        </p>
        <EditDrillForm drill={drill} />
      </div>
    </div>
  );
};

export default Page;
