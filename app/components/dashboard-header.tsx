
import { DashboardSheet } from './dashboard-sheet';
import { UserNav } from './user-nav';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <DashboardSheet />
      <div className="ml-auto flex items-center gap-2">
        <UserNav />
      </div>
    </header>
  );
}
