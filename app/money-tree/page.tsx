import Link from "next/link";

export default function MoneyTreePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-heading font-heading">머니나무 마당</h1>
      <p className="text-body">아직 준비 중이에요. 곧 씨앗을 심을 수 있어요!</p>
      <Link
        href="/town"
        className="min-h-touch min-w-touch rounded-full bg-district2-primary px-6 py-2 text-body text-white"
      >
        마을로 돌아가기
      </Link>
    </main>
  );
}
