import sys

try:
    import fitz
    doc = fitz.open("AHCI Project.pdf")
    text = ""
    for page in doc:
        text += page.get_text()
except ImportError:
    try:
        import pypdf
        reader = pypdf.PdfReader("AHCI Project.pdf")
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    except ImportError:
        print("No pdf reader found")
        sys.exit(1)

lines = text.split('\n')
for i, line in enumerate(lines):
    if 'wireframe' in line.lower() or 'task' in line.lower() or 'prototyp' in line.lower() or 'design' in line.lower():
        start = max(0, i - 2)
        end = min(len(lines), i + 3)
        print(f"--- MATCH ---")
        for j in range(start, end):
            print(lines[j].strip())
