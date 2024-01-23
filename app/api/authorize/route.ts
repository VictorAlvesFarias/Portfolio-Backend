import mongoose from 'mongoose';
import Password from '@/entitites/Password';
import { uri } from '@/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest) {

    await mongoose.connect(uri);

    const { accessKey } = await req.json();

    const maxDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const currentPassword = await Password.find({ date: { $gte: maxDate  } })

    if(currentPassword[0]!=null&&currentPassword[0].code==accessKey) {
        return NextResponse.json({
            message: "Authorized",
            data: {
                authorized: true
            }
        }, {
            status: 200
        });
    }

    else{
        return NextResponse.json({
            message: "Unauthorized",
            data: {
                authorized: false
            }
        }, {
            status: 401
        });
    }

}


