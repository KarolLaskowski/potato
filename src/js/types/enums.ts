enum BadgeColors {
  Unblocked = 'darkgreen',
  Blocked = 'red',
}

enum TabStatus {
  Unloaded = 'unloaded',
  Loading = 'loading',
  Complete = 'complete',
}

enum TableColumnType {
  DeleteButton,
  Text,
}

enum TableSchema {
  BlockedPages,
  AllowedPages,
}

export { TableColumnType, TabStatus, BadgeColors, TableSchema };
