import locationService from '@/services/locationService';
import { NextResponse } from 'next/server';

const GET = async () => {
    return NextResponse.json(locationService.getLocations())
} 

export {GET}

