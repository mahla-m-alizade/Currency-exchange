import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  const url = `http://api.navasan.tech/latest/?api_key=${apiKey}`;

  const resp = await fetch(url);
  const data = await resp.json();

  return NextResponse.json({
    value: data["usd_buy"],
  });
}
