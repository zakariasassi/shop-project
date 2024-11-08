'use client'

import React from 'react'
import { useQuery } from 'react-query'
import { getMainCategories } from '../../api/MainCategory'
import { IMAGE_URL } from '../../constant/URL'
import { Link } from 'react-router-dom'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function MainCategories() {
  const { data: categories, isLoading } = useQuery(
    ['categories', 'main-category'],
    () => getMainCategories('main-category')
  )

  return (
    <Card className="w-full mt-4 overflow-hidden ">
      <CardContent className="p-0">
        <div className="flex items-center justify-center h-12 bg-primary">
          <h2 className="text-4xl font-bold text-last">التصنيفات</h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
          <div className="flex p-4 space-x-4 space-x-reverse">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))
              : categories?.map((category) => (
                  <Link
                    to={'/products/bymainCategory'}
                    state={{ id: category.id }}
                    key={category.id}
                    className="flex flex-col items-center space-y-2 transition-opacity duration-300 hover:opacity-80"
                  >
                    <img
                      src={`${IMAGE_URL}mcategory/${category.image}`}
                      alt={category.name}
                      className="object-cover w-40 h-40 border-2 rounded-full "
                    />
                    <p className="text-xs font-medium text-center max-w-[80px] truncate">
                      {category.name}
                    </p>
                  </Link>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default MainCategories