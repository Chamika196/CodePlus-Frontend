import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Component({
  selector: 'app-edit-blogpost',
  
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy{

  id: string | null = null;
  model?: BlogPost;
  categories$? : Observable<Category[]>;
  selectedCategories?: string[];
  
  routeSubscription?: Subscription;
  upadateBlogPostSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;

  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router)
  {

  }
  
   ngOnInit(): void { 
    this.categories$ = this.categoryService.getAllCategories();
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');

        //Get Blogpost From API
        if(this.id){
          this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x => x.id);
            }
          })
        }
      }
    });
  }
  onFormSubmit() {
    //Convert this model to Request Object
    if(this.model && this.id){
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? [],
        title: ''
      };

      this.upadateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id,
        updateBlogPost)
        .subscribe({
          next:(response) =>{
            this.router.navigateByUrl('/admin/blogposts');
          }
        });
    }

    }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.upadateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
  }


}
