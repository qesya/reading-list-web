"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, BookInput } from "@/lib/validation";
import { useTransition } from "react";
import { addBook, updateBook } from "@/actions/book";
import { useRouter } from "next/navigation";
import { type Book } from "@/generated/prisma";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidImagePath } from "@/lib/utils";

type BookFormProps = {
  book?: Book;
};

export function BookForm({ book }: BookFormProps) {
  const form = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      cover: book?.cover || "",
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: BookInput) => {
    startTransition(async () => {
      if (book) {
        await updateBook(book.id, data);
      } else {
        await addBook(data);
      }
      router.push("/");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {book ? "✍️ Edit Book" : "➕ Add a New Book"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Atomic Habits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. James Clear" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. https://example.com/cover.jpg"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);

                        if (value.trim() && !isValidImagePath(value)) {
                          form.setError("cover", {
                            type: "manual",
                            message: "Please enter a valid image URL or path.",
                          });
                        } else {
                          form.clearErrors("cover");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {form.watch("cover")?.trim() &&
                    isValidImagePath(form.watch("cover") ?? "") &&
                    !form.formState.errors.cover && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Cover Preview:
                        </h3>
                        <div className="relative w-24 h-32 border rounded-md overflow-hidden">
                          <Image
                            src={form.watch("cover") ?? ""}
                            alt="Cover Preview"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                    )}
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : book ? "Save Changes" : "Add Book"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
