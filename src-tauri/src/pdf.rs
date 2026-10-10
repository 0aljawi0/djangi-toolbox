use printpdf::*;
use std::fs::File;
use std::io::BufWriter;

const PAGE_W: f32 = 210.0;   // A4 mm
const PAGE_H: f32 = 297.0;
const LEFT:   f32 = 15.0;
const RIGHT:  f32 = 195.0;
const BOTTOM: f32 = 20.0;
const LINE_H: f32 = 3.2;

/// Generate a single PDF containing every file with line numbers.
pub fn generate_pdf(output: &str, files: &[String]) -> Result<(), String> {
    let (doc, first_page, first_layer) =
        PdfDocument::new("Djangi Toolbox", Mm(PAGE_W), Mm(PAGE_H), "Content");

    let mono   = doc.add_builtin_font(BuiltinFont::Courier).map_err(|e| e.to_string())?;
    let bold   = doc.add_builtin_font(BuiltinFont::CourierBold).map_err(|e| e.to_string())?;

    let mut layer = doc.get_page(first_page).get_layer(first_layer);
    let mut y = PAGE_H - 20.0;

    // --- Header ---
    layer.use_text("DJANGI TOOLBOX", 14.0, Mm(LEFT), Mm(y), &bold);
    y -= 5.0;
    let subtitle = format!(
        "// SOURCE CODE EXPORT  •  {} file(s)",
        files.len()
    );
    layer.use_text(&subtitle, 7.0, Mm(LEFT), Mm(y), &mono);
    y -= 10.0;

    for path in files {
        let content = match std::fs::read_to_string(path) {
            Ok(c) => c,
            Err(e) => format!("// (unreadable: {e})"),
        };
        let name = std::path::Path::new(path)
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_else(|| path.clone());

        // New page if the header won't fit
        if y < BOTTOM + 20.0 {
            let (p, l) = doc.add_page(Mm(PAGE_W), Mm(PAGE_H), "Content");
            layer = doc.get_page(p).get_layer(l);
            y = PAGE_H - 20.0;
        }

        // File header block
        layer.use_text(&name, 10.0, Mm(LEFT), Mm(y), &bold);
        y -= 4.0;
        layer.use_text(path, 6.0, Mm(LEFT), Mm(y), &mono);
        y -= 6.0;

        for (i, line) in content.lines().enumerate() {
            if y < BOTTOM {
                let (p, l) = doc.add_page(Mm(PAGE_W), Mm(PAGE_H), "Content");
                layer = doc.get_page(p).get_layer(l);
                y = PAGE_H - 20.0;
            }
            // Truncate — Courier 6pt is ~3.4pt/char → ~110 chars fit
            let truncated: String = line.chars().take(115).collect();
            let text = format!("{:>4}  {}", i + 1, truncated);
            layer.use_text(&text, 6.0, Mm(LEFT), Mm(y), &mono);
            y -= LINE_H;
        }
        y -= 5.0;
    }

    // Avoid "unused" warnings in case truncation is refactored later
    let _ = RIGHT;

    let file = File::create(output).map_err(|e| e.to_string())?;
    doc.save(&mut BufWriter::new(file)).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn generate_pdf_cmd(output: String, files: Vec<String>) -> Result<(), String> {
    generate_pdf(&output, &files)
}