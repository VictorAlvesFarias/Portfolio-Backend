import Profile from '@/entitites/Profile';
import { uri } from '@/env';
import { Authorize } from '@/extensions/Auth';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

function sum(range:any) {
    let value = 0
    console.log(range)
    range.forEach((i:any) => {
        value =+ i.percentage
    });
    return value
}

async function getRepositories(username:string) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function getLanguagesForRepository(username:string, repoName:string) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function calculateLanguagePercentage(username:string) {
    const repositories = await getRepositories(username);
    const languageStats:any = {};

    for (let index = 0; index < repositories.length; index++) {

        const languages = await getLanguagesForRepository(username, repositories[index].name)

        for (const lang in languages) {

            if(languageStats[lang])
            languageStats[lang] += languages[lang];

            else
            languageStats[lang] = languages[lang]
        }
    };
    const languagePercentage:any = {};

    const totalLines:any = Object.values(languageStats).reduce((acc:any, val:any) => acc + val, 0);

    for (const lang in languageStats) {
      languagePercentage[lang] = (languageStats[lang] / totalLines) * 100;
    }

    const response = Object.keys(languagePercentage).map(nomedachave => {console.log(nomedachave);return ({
        name: nomedachave,
        percentage: languagePercentage[nomedachave]
    })});

    response.push({
        name:"Others",
        percentage: sum(response.filter( (item:any)=> item.percentage < 5))
    }) 

    return  response.filter((item:any)=>(item.percentage > 5||item.name=="Others"));
}

async function getPorcentages(username:string) {
    return await calculateLanguagePercentage(username)
    .then((result) => {
    const languageArray = result

    languageArray.sort((a, b) => b.percentage - a.percentage);

        return languageArray
    })
    .catch((error) => {
    console.error('Ocorreu um erro:', error);
    });
}

function newPostIsValid(date1Obj:string) {
  const date_1: any = new Date(new Date().toISOString())

  const date_2: any = new Date(date1Obj)

  const timeDifference = Math.abs(date_1- date_2);

  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  if (timeDifference > oneWeekInMilliseconds) {
    return true;
  } else {
    return false;
  }
}

export async function GET() {


    await mongoose.connect(uri);
    
    const item =  await Profile.findOne({}).sort({ date: -1 })

    if (item == null) {
        const data = await getPorcentages("victoralvesfarias")

        const p = new Profile({
            languages:data,
            date: new Date().toISOString()
        });
        const save = await p.save()
        await mongoose.connection.close();
        return NextResponse.json(save);
    } 

    else if(newPostIsValid(item.date)) {
        const data = await getPorcentages("victoralvesfarias")

        const p = new Profile({
            languages:data,
            date: new Date().toISOString()
        });
        await p.save()
        await mongoose.connection.close();
        return NextResponse.json(p);
    }
    
    else {
        await mongoose.connection.close();
        return NextResponse.json(item);
    }
}



