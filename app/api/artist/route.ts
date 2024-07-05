import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    // const access_token =  req.nextUrl.searchParams.get('token');

    const access_token = cookies().get('access_token')?.value;
    console.log('Access token:', access_token);

    const result = NextResponse.redirect(`${req.nextUrl.origin}/artist/${id}`);
    
    if (access_token) {
        result.cookies.set('access_token', access_token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
        });
    }

    return result;
}