import express, { Request, Response } from "express";
import { Parking } from "../DB/Entities/Parking";
const insertParking = (payload: Parking) => {
    const newParking = Parking.create(payload);
    console.log(payload);
    
    return newParking.save();
    
};

const getAllParkings =async (payload:GetAll) => {
    const page = parseInt(payload.page);
    const pageSize = parseInt(payload.pageSize);

    const [parkings, total] = await Parking.findAndCount({
        skip: pageSize*(page-1),
        take: pageSize,
        order: {
            customid: 'ASC',
        }
    })
    return {
        page, 
        pageSize: parkings.length,
        total,
        parkings
    }
}
export {insertParking, getAllParkings};