import { mutation } from "./_generated/server";

export const fixFileCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    let count = 0;
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((file as any).category === "shared_file") {
        await ctx.db.patch(file._id, { category: "general" });
        count++;
      } 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else if ((file as any).category === "deliverable") {
        await ctx.db.patch(file._id, { category: "artifact" });
        count++;
      }
    }
    return `Fixed ${count} files`;
  },
});
