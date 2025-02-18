import os

path = "."
indicator_string_start = "<!-- global script -->"
indicator_string_end = "<!-- end global script -->"
stuff2add = """
<script src="/global.js"></script>
"""
files: list[str] = [os.path.join(dp, f) for dp, dn, fn in os.walk(path) for f in fn]

files_changed=0
files_failed=0

for fn in files:
    try:
        if fn.endswith(".html"):
            print(fn)
            with open(fn, 'r') as f:
                text=f.read()
            indicator_idx=text.find(indicator_string_start)
            if indicator_idx != -1:
                print("  im skippin")
            text += indicator_string_start + "\n"
            text += stuff2add
            text += indicator_string_end + "\n"
            with open(fn, 'w') as f:
                f.write(text)
            files_changed+=1
    except:
        print(f"womp womp: {fn}")
        files_failed+=1

print("im done")
print(f"{files_changed=}")
print(f"{files_failed=}")
