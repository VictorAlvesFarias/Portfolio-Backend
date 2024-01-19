import Project from '@/entitites/Project';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {hash, uri} from '../../../env'
import Password from '@/entitites/Password';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    await mongoose.connect(uri);

    const { password } = await req.json();

    const maxDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if(password==hash) {

        const currentPassword = await Password.find({ date: { $gte: maxDate  } })

        if(currentPassword[0]==null){

            const accessKey = new Password({
                date: new Date().toISOString(),
                code: randomUUID()
            }) 

            accessKey.save()

            return NextResponse.json({
                accessKey: accessKey
              }, {
                status: 200,
            })
        }
        else {
            return NextResponse.json({
                accessKey: currentPassword
              }, {
                status: 200,
            })
        }
    }

    else {

        return NextResponse.json({
            message: ""
        }, {
            status: 401,
        })
    }
}

