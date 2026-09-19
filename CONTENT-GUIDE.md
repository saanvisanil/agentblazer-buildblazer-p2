# Updating the website without writing code

Once the admin password is set up (see README "Deploying"), a club lead does
this entirely from a browser — no GitHub, no code editor.

1. Go to `https://your-site-url/admin`
2. Enter the admin password
3. Pick a tab:
   - **Events** — add, edit, or remove workshops/contests
   - **Team** — add, edit, or remove people (guests, faculty, officers, committee)
   - **Site text** — homepage description, stats, email, Join page intro
   - **Applications** — everyone who has submitted the Join form
4. Click **Save changes**

Saving commits the change straight to the GitHub repository. Vercel notices
the new commit and rebuilds the site automatically — the update goes live
within about a minute, no redeploy step needed by hand.

## If you'd rather edit the files directly (fallback)

Every editable admin field lives in a plain JSON file in `content/`:

| File | Controls |
|---|---|
| `content/events.json` | Everything on the Events & Workshops page |
| `content/team.json` | Everyone on the About Us page (`group` is `guest`, `faculty`, `officer`, or `committee`) |
| `content/site.json` | Hero text, stats, Join page copy, contact email |

You can edit these on GitHub.com directly (pencil icon → edit → commit) even
without the admin page. Keep every value in double quotes and every entry
except the last one ending with a comma — a missing comma is the most common
cause of a failed build.
