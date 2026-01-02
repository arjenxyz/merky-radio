import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // src/lib değil, direkt lib (senin yapına göre)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, username, avatar } = body;

    // 1. Önce bu kullanıcı var mı diye bakalım
    const { data: existingUser, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("discord_id", id)
      .single();

    // fetchError varsa ve bu hata "Veri bulunamadı" hatası DEĞİLSE, gerçek bir sorun vardır.
    // (PGRST116 kodu: 'JSON object requested, multiple (or no) rows returned' demektir, yani kullanıcı yok demek.)
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Supabase Okuma Hatası:", fetchError); // Hatayı konsola basarak 'unused var' uyarısını çözdük
      return NextResponse.json({ success: false, error: "Veritabanına erişilemedi." }, { status: 500 });
    }

    if (existingUser) {
      // KULLANICI VARSA
      return NextResponse.json({ 
        success: true, 
        user: existingUser,
        isNew: false 
      });
    }

    // KULLANICI YOKSA: Yeni kayıt oluştur
    const { data: newUser, error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          discord_id: id,
          username: username,
          avatar_url: avatar,
          merky_balance: 100, // Hoş geldin bonusu!
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase Yazma Hatası:", insertError); // Hatayı kullandık
      return NextResponse.json({ success: false, error: "Yeni kullanıcı oluşturulamadı." }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      isNew: true 
    });

  } catch (error) {
    console.error("API Kritik Hata:", error); // Hatayı kullandık
    return NextResponse.json({ success: false, error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}