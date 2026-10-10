// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod scanner;
mod pdf;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            scanner::scan_folder,
            scanner::file_entry,
            scanner::get_recommended_scan_settings,
            pdf::generate_pdf_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
