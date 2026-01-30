import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Gagal ambil kategori" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
