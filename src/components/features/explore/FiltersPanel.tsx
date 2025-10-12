import { SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";

export default function FiltersPanel({
  title,
  category, setCategory,
  price, setPrice,
  sortBy, setSortBy,
  date, setDate,
}: {
  title: string;
  category: string; setCategory: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  sortBy: string; setSortBy: (v: string) => void;
  date?: Date; setDate: (v?: Date) => void;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
      <div className="flex items-center gap-3 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Chill & Relax">🌿 Chill & Relax</SelectItem>
              <SelectItem value="Active">⚡ Active</SelectItem>
              <SelectItem value="Social">🎉 Social</SelectItem>
              <SelectItem value="Educational">📚 Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Price</label>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="paid">Paid Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full rounded-2xl justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              {date && (
                <div className="p-3 border-t">
                  <Button variant="outline" onClick={() => setDate(undefined)} className="w-full rounded-xl">
                    Clear Date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="date">Upcoming Date</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="nearby">Nearest to Me</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}