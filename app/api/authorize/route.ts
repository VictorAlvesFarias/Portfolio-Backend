import mongoose from 'mongoose';

import Password from '@/entitites/Password';
import { uri } from '@/env';

export async function POST(req:NextApiRequest) {
    
    await mongoose.connect(uri);

    const { accessKey } = await req.json();

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

