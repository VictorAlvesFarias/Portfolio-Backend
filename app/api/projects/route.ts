import Project from '@/entitites/Project';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { uri } from '../../../env';
import { verify } from '../../../extensions/validate';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('auth');
    
    if (await verify(authHeader)) {
        await mongoose.connect(uri);

        const projects = await Project.find({})

        const { name, order, description, img } = await req.json();

        const similarProject = projects.filter(x => x.order == order)
        
        const p = new Project({
            name: name,
            order: similarProject.length > 0 ? similarProject[0].order : order,
            src: "ok",
            description: description
        });

        if (similarProject.length > 0) {
            similarProject[0].order = projects.sort((a, b) => a - b)[projects.length - 1].order + 1
            await Project.updateOne(similarProject[0])
        }

        const save = await p.save()

        return NextResponse.json(save);
    } else {
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 401
        });
    }
}

export async function DELETE(req: NextRequest) {
    const authHeader = req.headers.get('auth');
    
    if (await verify(authHeader)) {
        const id = new URL(req.url).searchParams.get("id")

        await mongoose.connect(uri);

        const project = await Project.findById(id)

        const result = await project.deleteOne(project)

        return NextResponse.json(result);
    } else {
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 401
        });
    }
}

export async function GET(req: NextRequest) {

    await mongoose.connect(uri);

    const projects = await Project.find({})

    return NextResponse.json(projects);
}
