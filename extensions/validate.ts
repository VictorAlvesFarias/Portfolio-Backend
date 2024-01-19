import Project from '@/entitites/Project';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {uri} from '../env'
import Password from '@/entitites/Password';

export async function verify(req:any) {
    
    await mongoose.connect(uri);

    const { accessKey } = await req;

    const maxDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const currentPassword = await Password.find({ date: { $gte: maxDate  } })

    if(currentPassword[0]!=null&&currentPassword[0].code==accessKey) {
        return {
            authorized: true
        }
    }

    else{
        return {
            authorized: false
        }
    }

}

