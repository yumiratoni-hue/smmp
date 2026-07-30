import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { userId, serviceId, link, quantity, price, providerServiceId } = await req.json();

    // 1. Cek saldo user di Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data().balance < price) {
      return NextResponse.json({ error: "Saldo tidak mencukupi" }, { status: 400 });
    }

    // 2. Tembak API Provider SMM
    const providerRes = await fetch("https://provider-smm.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.SMM_PROVIDER_API_KEY,
        action: "add",
        service: providerServiceId,
        link: link,
        quantity: quantity,
      }),
    });

    const providerData = await providerRes.json();

    if (providerData.error) {
      return NextResponse.json({ error: providerData.error }, { status: 400 });
    }

    // 3. Potong saldo user & Simpan orderan ke Firestore
    await updateDoc(userRef, {
      balance: userSnap.data().balance - price,
    });

    await addDoc(collection(db, "orders"), {
      userId,
      serviceId,
      link,
      quantity,
      price,
      providerOrderId: providerData.order,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, orderId: providerData.order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
