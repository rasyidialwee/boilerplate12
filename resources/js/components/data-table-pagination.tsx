import { Link } from '@inertiajs/react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => string;
    onPerPageChange: (perPage: number) => void;
    perPageOptions?: number[];
}

export default function DataTablePagination({
    currentPage,
    lastPage,
    perPage,
    total,
    onPageChange,
    onPerPageChange,
    perPageOptions = [10, 25, 50, 100],
}: DataTablePaginationProps) {
    const handlePerPageChange = (value: string) => {
        onPerPageChange(Number(value));
    };

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Rows per page
                </span>
                <Select
                    value={perPage.toString()}
                    onValueChange={handlePerPageChange}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {perPageOptions.map((option) => (
                            <SelectItem key={option} value={option.toString()}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
            </div>

            <div className="flex items-center gap-1">
                {currentPage === 1 ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled
                    >
                        <ChevronFirst className="h-4 w-4" />
                        <span className="sr-only">First page</span>
                    </Button>
                ) : (
                    <Link href={onPageChange(1)}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <ChevronFirst className="h-4 w-4" />
                            <span className="sr-only">First page</span>
                        </Button>
                    </Link>
                )}
                {currentPage === 1 ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                ) : (
                    <Link href={onPageChange(currentPage - 1)}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button>
                    </Link>
                )}
                {currentPage === lastPage ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                ) : (
                    <Link href={onPageChange(currentPage + 1)}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button>
                    </Link>
                )}
                {currentPage === lastPage ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled
                    >
                        <ChevronLast className="h-4 w-4" />
                        <span className="sr-only">Last page</span>
                    </Button>
                ) : (
                    <Link href={onPageChange(lastPage)}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <ChevronLast className="h-4 w-4" />
                            <span className="sr-only">Last page</span>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

