import { mutation } from "./_generated/server";

export const fixFileCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    let count = 0;
    for (const file of files) {
      // @ts-ignore
      if (file.category === "shared_file") {
        await ctx.db.patch(file._id, { category: "general" });
        count++;
      } 
      // @ts-ignore
      else if (file.category === "deliverable") {
        await ctx.db.patch(file._id, { category: "artifact" });
        count++;
      }
    }
    return `Fixed ${count} files`;
  },
});
