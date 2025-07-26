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
      <h2 className="text-2xl font-bold">{drill.name}</h2>
    </Main>
  );
};

export default Page;
