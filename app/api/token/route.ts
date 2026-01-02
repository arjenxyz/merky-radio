import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    // DEBUG: Gelen kod ve ENV kontrolü
    console.log("--- TOKEN TAKASI BAŞLADI ---");
    console.log("Gelen Code:", code ? "Var (Uzunluk: " + code.length + ")" : "YOK!");
    console.log("Client ID:", process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ? "Yüklü" : "EKSİK!");
    console.log("Client Secret:", process.env.DISCORD_CLIENT_SECRET ? "Yüklü" : "EKSİK! (Sorun Burada Olabilir)");

    if (!process.env.DISCORD_CLIENT_SECRET) {
        throw new Error("DISCORD_CLIENT_SECRET .env dosyasında bulunamadı!");
    }

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code: code,
    });

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    
    // DEBUG: Discord'dan gelen cevap
    if (!response.ok) {
        console.error("Discord API Hatası:", data);
        return NextResponse.json({ error: data }, { status: 400 });
    }

    console.log("Token Başarıyla Alındı!");
    return NextResponse.json(data);

  } catch (error: unknown) {
    let errorMessage = "Bilinmeyen hata";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("API Route Hatası (Detaylı):", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}