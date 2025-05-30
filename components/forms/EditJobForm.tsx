"use client"
import { cityList } from "@/app/utils/cityList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { SalaryRangeSelector } from "../general/SalaryRangeSelector";
import JobDescriptionEditor from "../richTextEditor/JobDescriptionEditor";
import BenefitsSelector from "../general/BenefitsSelector";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "../general/UploadThingreexported";
import Image from "next/image";
import { JobListingDuration } from "../general/JobListingDurationSelector";
import { jobSchema } from "@/app/utils/zodSchemas";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createJob, editJobPost } from "@/app/actions";

interface iAppProps{
    jobPost: {
        jobTitle: string;
        location: string;
        salaryFrom: number;
        salaryTo: number;
        jobDescription: string;
        listingDuration: number;
        benefits: string[];
        id: string;
        company: {
            location: string;
            name: string;
            about: string;
            logo: string;
            website: string;
            xAccount: string | null;
        };
        employmentType: string;
    }
}

export function EditJobForm({jobPost}:iAppProps){

      const form = useForm<z.infer<typeof jobSchema>>({
            resolver:zodResolver(jobSchema),
            defaultValues:{
                benefits:jobPost.benefits,
                companyAbout:jobPost.company.about,
                companyLocation:jobPost.company.location,
                companyLogo:jobPost.company.logo,
                companyName:jobPost.company.name,
                companyWebsite:jobPost.company.website,
                companyXAccount:jobPost.company.xAccount || "",
                employementType:jobPost.employmentType,
                jobDescription:jobPost.jobDescription,
                jobTitle:jobPost.jobTitle,
                listingDuration:jobPost.listingDuration,
                location:jobPost.location,
                salaryFrom:jobPost.salaryFrom,
                salaryTo:jobPost.salaryTo,
    
    
            }
        });

 const [pending,setPending] = useState(false);

    async function onSubmit(values:z.infer<typeof jobSchema>){
        try{
            setPending(true);
            await editJobPost(values,jobPost.id);
        }catch(error){
            if(error instanceof Error && error.message !== "NEXT_REDIRECT"){
                console.log("something went worng");
            }
        }finally{
            setPending(false);
        }
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


                            <FormField 
                                control={form.control}
                                name="employementType"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                           Employment Type
                                        </FormLabel>
                                       <Select onValueChange={field.onChange}
                                       defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="select Emplyoment Type" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent >
                                                    <SelectGroup>
                                                        <SelectLabel>Employment Type</SelectLabel>
                                                        <SelectItem value="full-time">Full Time</SelectItem>
                                                        <SelectItem value="part-time">Part Time</SelectItem>
                                                        <SelectItem value="contract">Contract</SelectItem>
                                                        <SelectItem value="internship">Internship</SelectItem>

                                                    </SelectGroup>
                                                </SelectContent>
                                       </Select>
                                        <FormMessage />
                                    </FormItem>
                              )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                                control={form.control}
                                name="location"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                           Job Location
                                        </FormLabel>
                                       <Select onValueChange={field.onChange}
                                       defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="select Location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectGroup>
                                                        <SelectLabel>Worldwide</SelectLabel>
                                                        <SelectItem value="worldwide"><span>🌍</span><span className="pl-2">Worldwide / Remote</span></SelectItem>
 

                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {cityList.map((cite)=>(
                                                                <SelectItem key={cite.id} value={cite.name}>
                                                                        <span className="pl-2">{cite.name}</span>
                                                                </SelectItem>
                                                            ))}
                                                          </SelectLabel>
                                                    </SelectGroup>
                                                </SelectContent>
                                       </Select>
                                        <FormMessage />
                                    </FormItem>
                              )}
                            />
                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                    <FormControl>
                                        <SalaryRangeSelector  
                                        control={form.control}
                                        minSalary={10000}
                                        maxSalary={1000000}
                                        currency="USD"
                                        step={2000}
                                        />
                                    </FormControl>
                            </FormItem>
                        </div>


                        <FormField control={form.control}
                        name="jobDescription"
                        render={({ field })=>(
                            <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                    <JobDescriptionEditor field={field as any} />
                                    
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormField  control={form.control}
                        name="benefits"
                        render={({field})=>(
                            <FormItem>
                                    <FormLabel>
                                        Benefits
                                    </FormLabel>
                                    <FormControl>
                                        <BenefitsSelector field={field as any} />
                                    </FormControl>
                                    <FormMessage/>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField 
                            control={form.control}
                            name="companyName"
                            render = {({field})=>(
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company Name..." {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />


                               <FormField 
                                control={form.control}
                                name="companyLocation"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                           Company Location
                                        </FormLabel>
                                       <Select onValueChange={field.onChange}
                                       defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="select Location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectGroup>
                                                        <SelectLabel>Worldwide</SelectLabel>
                                                        <SelectItem value="worldwide"><span>🌍</span><span className="pl-2">Worldwide / Remote</span></SelectItem>
 

                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {cityList.map((cite)=>(
                                                                <SelectItem key={cite.id} value={cite.name}>
                                                                        <span className="pl-2">{cite.name}</span>
                                                                </SelectItem>
                                                            ))}
                                                          </SelectLabel>
                                                    </SelectGroup>
                                                </SelectContent>
                                       </Select>
                                        <FormMessage />
                                    </FormItem>
                              )}
                            />

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                            control={form.control}
                            name="companyWebsite"
                            render = {({field})=>(
                                <FormItem>
                                    <FormLabel>Company Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company website..." {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField 
                            control={form.control}
                            name="companyXAccount"
                            render = {({field})=>(
                                <FormItem>
                                    <FormLabel>Company X Account</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company X Account" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField 
                            control={form.control}
                            name="companyAbout"
                            render = {({field})=>(
                                <FormItem>
                                    <FormLabel>Company Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="About your Company" className="min-h-[120px]" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

<FormField control={form.control}
                    name="companyLogo"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Company Logo</FormLabel>
                            <FormControl>
                                <div >
                                    {field.value ? (
                                        <div className="relative w-fit">
                                            <Image src={field.value} alt="Company Logo" width={100} height={100} className="rounded-lg"/>
                                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2" onClick={()=>field.onChange("")}>
                                                <XIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ):(<UploadDropzone endpoint="imageUploader" 
                                        onClientUploadComplete={(res)=>{
                                            field.onChange(res[0].url);
        
                                        }}
                                        onUploadError={()=>{
                                            console.log("something went worng")
                                        }}
                                        className="ut-button:bg-primary ut-button:text-white
                                        ut-button:hover:bg-primary/90 ut-label:text-muted-foreground
                                        ut-allowed-content:text-muted-foreground border-primary"
                                        />)}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    </CardContent>
                </Card>

                
                <Button type="submit" className="w-full" disabled={pending}>
                                {pending ? "Submitting... ": "Edit Job Post"}
                </Button>
            </form>
        </Form>
    )
}