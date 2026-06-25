mod api;

use api::{HomeFeedResult, RemoteSettingResult, SearchAlbumsResult, WeekRecommendationsResult};

#[tauri::command]
async fn get_remote_setting(endpoint: Option<String>) -> Result<RemoteSettingResult, String> {
    api::get_remote_setting(endpoint)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
async fn search_comics(
    query: String,
    page: Option<u32>,
    endpoint: Option<String>,
) -> Result<SearchAlbumsResult, String> {
    api::search_comics(query, page, endpoint)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
async fn get_home_feed(endpoint: Option<String>) -> Result<HomeFeedResult, String> {
    api::get_home_feed(endpoint)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
async fn get_week_recommendations(
    page: Option<u32>,
    category_id: Option<String>,
    type_id: Option<String>,
    endpoint: Option<String>,
) -> Result<WeekRecommendationsResult, String> {
    api::get_week_recommendations(page, category_id, type_id, endpoint)
        .await
        .map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_remote_setting,
            search_comics,
            get_home_feed,
            get_week_recommendations
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
