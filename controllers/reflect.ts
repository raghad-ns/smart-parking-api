import { GetAll } from "../@types";
import { Reflect } from "../DB/Entities/Reflect";

const getReflectUsers =async (payload:GetAll) => {
    const page = parseInt(payload.page);
    const pageSize = parseInt(payload.pageSize);

    const [users, total] = await Reflect.findAndCount({
        skip: pageSize*(page-1),
        take: pageSize,
        order: {
            owner: 'ASC',
        }
    })
    return {
        page, 
        pageSize: users.length,
        total,
        users
    }
}

const insertReflectUser = (payload: Reflect) =>{
    const newReflect = Reflect.create(payload);
    return newReflect.save();
}

export {getReflectUsers, insertReflectUser}