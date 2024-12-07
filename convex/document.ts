import {mutation, query} from "./_generated/server"
import {v} from "convex/values"

export const createDocument = mutation(
    {
        args : {
            userID : v.string(),
            title : v.string(),
            type : v.string(),
            key : v.string(),
            description : v.optional(v.string()),
            date : v.optional(v.number()),
        },
        handler : async (ctx,args) => {
            const newDocument = await ctx.db.insert("documents",{userID : args.userID, title : args.title, type : args.type, description : args.description, key : args.key, date : Date.now()})
            return newDocument
        }
    }
)

export const viewDocument = mutation(
    {
        args : {
            _id : v.id("documents")
        },
        handler : async(ctx,args) => {
            const getDocument = await ctx.db.get(args._id)
            return getDocument
        }
    }
)

export const viewAllDocuments = mutation(
    {
        args : {
            userID : v.string()
        },
        handler : async (ctx,args) => {
            const allDocuments = await ctx.db.query("documents").filter((doc)=> doc.eq(doc.field("userID"),args.userID)).order("desc")
            return allDocuments.collect()
        }
    }
)

export const deleteDocument = mutation(
    {
        args : {
            _id : v.id("documents")
        },
        handler : async (ctx,args) =>{
            const deleteDocument = await ctx.db.delete(args._id)
            return deleteDocument
        }
    }
)
