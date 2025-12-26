import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import {
  IBlogPost,
  blogValidationSchema,
  createSlug,
  getBlogPostInitialValues,
  handleSubmitBlog,
  removeSpecialCharacters,
} from "../BlogFormController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import ICFormikTextArea from "../../../components/formik-input/ICFormikTextIArea";
import ICFileUpload from "../../../core-component/ICFileUpload";
import { WithContext as ReactTags } from "react-tag-input";
import { fetchUploadImageService } from "../../image-service/ImageServices";
import {
  getLocalDate,
  prepareMessageFromParams,
  sweetAlertError,
} from "../../../utils/AppFunctions";
import BackButton from "../../../components/common/BackButton";
import ICTextInput from "../../../core-component/ICTextInput";
import { useLocation, useNavigate } from "react-router-dom";
import ICCheckbox from "../../../core-component/ICCheckbox";
import { fetchBlogByIdForUpdate } from "../BlogPostController";
import ICButton from "../../../core-component/ICButton";
import {
  FILE_UPLOAD,
  FILE_UPLOAD_TYPE,
  IMAGE_TYPE,
  MEDIA_TYPE,
} from "../../../utils/AppEnumerations";
export interface IOption<T> {
  label: string;
  value: T;
}

export interface IMediaItemImage {
  media_type: string;
  media_url: string;
}

const TrainerCreatePost = () => {
  const [blogsFormInitialValues, setBlogsFormInitialValues] =
    useState<IBlogPost>();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [blogsImage, setBlogsImage] = useState<IMediaItemImage[]>([]);
  const [publishValue, setPublishValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { t } = UseTranslationHook();
  const blogToEdit = location?.state?.object;
  useEffect(() => {
    if (blogToEdit) {
      fetchBlogByIdForUpdate(blogToEdit.id, setBlogsFormInitialValues, setTags);
    } else {
      setBlogsFormInitialValues(getBlogPostInitialValues());
    }
  }, []);

  useEffect(() => {
    if (
      blogsFormInitialValues?.blogs_media &&
      blogsFormInitialValues.blogs_media.length > 0
    ) {
      const transformedData = blogsFormInitialValues.blogs_media.map(
        (item) => ({
          ...item,
        })
      );

      setBlogsImage(transformedData);
    } else {
      setBlogsImage([]);
    }
    if (
      blogsFormInitialValues?.cover_image &&
      blogsFormInitialValues.blogs_media.length > 0
    ) {
      setCoverImage([blogsFormInitialValues.cover_image]);
    } else {
      setCoverImage([]);
    }
  }, [blogsFormInitialValues]);

  const navigate = useNavigate();
  function checkFileType(fileType: string): string | null {
    if (fileType) {
      if (fileType === FILE_UPLOAD.Pdf) {
        return MEDIA_TYPE.pdf;
      } else if (
        fileType === FILE_UPLOAD.Png ||
        fileType === FILE_UPLOAD.Jpeg
      ) {
        return MEDIA_TYPE.image;
      } else if (fileType === FILE_UPLOAD.Video) {
        return MEDIA_TYPE.video;
      }
    }
    return null;
  }

  const handleSubmitBlogsWithFileUpload = async (values: IBlogPost) => {
    const updatedBlogsMedia = blogsImage ? [...blogsImage] : [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileType = checkFileType(file.type);
      const formData = new FormData();
      formData.append("myImageFile", selectedFiles[i]);
      formData.append("type", IMAGE_TYPE.Blogs);
      values.id && formData.append("typeId", values.id.toString());
      const mediaUrl = await fetchUploadImageService(formData);
      const newMediaItem = {
        media_type: fileType !== null ? fileType : "",
        media_url: mediaUrl,
        media_title: selectedFiles[i].name,
      };
      updatedBlogsMedia.push(newMediaItem);
    }
    const updatedBlogsCoverImage = coverImage ? coverImage : [];
    for (let i = 0; i < selectedCoverImage.length; i++) {
      const formData = new FormData();
      formData.append("myImageFile", selectedCoverImage[i]);
      formData.append("type", IMAGE_TYPE.Blogs);
      values.id && formData.append("typeId", values.id.toString());
      const mediaUrl = await fetchUploadImageService(formData);
      const newMediaItem = {
        media_type: "i",
        media_url: mediaUrl,
        media_title: selectedCoverImage[i].name,
      };
      updatedBlogsCoverImage.push(newMediaItem.media_url);
    }
    if (updatedBlogsMedia.length > 0) {
      handleSubmitBlog(
        {
          ...values,
          blogs_media: updatedBlogsMedia,
          slug: createSlug(values.blog_title),
          blog_meta_title: removeSpecialCharacters(values.blog_title),
          cover_image: updatedBlogsCoverImage[0],
          hash_tags: tags,
          publish_date: getLocalDate().toISOString(),
          published: publishValue,
          post_anonymously: values.post_anonymously,
        },
        setLoading,
        navigate,
        t,
        blogToEdit?.id
      );
    } else {
      sweetAlertError(t("you_have_to_select_file"));
    }
  };
  const updatePublishValue = (value: string) => {
    setPublishValue(value);
  };
  const handleDrag = (tag: any, currPos: any, newPos: any) => {};

  return (
    <div className="w-full comman-padding flex flex-col  overflow-hidden h-svh md:h-[calc(100vh-76px)]">
      <div className="flex space-x-5 items-center">
        <div>
          <BackButton />
        </div>
        <div className="comman-black-big">
          <p>{t("create_post")}</p>
        </div>
      </div>
      <div className="top  w-full  flex-1 overflow-scroll">
        <div className="flex items-center justify-center w-full">
          {blogsFormInitialValues && (
            <Formik
              initialValues={blogsFormInitialValues}
              enableReinitialize
              validationSchema={() => blogValidationSchema(t)}
              onSubmit={(values) => handleSubmitBlogsWithFileUpload(values)}
            >
              {(formikPorps) => {
                const { handleSubmit, values, submitCount } = formikPorps;
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className=" pt-2.5 max-w-sm">
                      <div>
                        <ICTextInput
                          name={"blog_title"}
                          value={formikPorps.values.blog_title}
                          placeholder={t("blog_title")}
                          onChange={formikPorps.handleChange}
                          onBlur={formikPorps.handleBlur}
                          errorMessage={
                            formikPorps.touched.blog_title &&
                            formikPorps.errors.blog_title
                              ? formikPorps.errors.blog_title
                              : undefined
                          }
                        />
                      </div>
                      <div className="top relative">
                        <p className="post-input mt-4  comman-grey">
                          {values?.blog_content?.length}/
                          {t("description_limit")}
                        </p>
                        <ICFormikTextArea
                          {...formikPorps}
                          name={"blog_content"}
                          onChangeText={(value) => {
                            value.length <= 300 &&
                              formikPorps.setFieldValue("blog_content", value);
                          }}
                          placeholder={t("blog_content")}
                        />
                      </div>
                      <div className="w-full">
                        <div className="inline-flex w-full flex-wrap">
                          <ReactTags
                            tags={tags.map((tag) => ({ id: tag, text: tag }))}
                            handleDelete={(index: number) =>
                              setTags(tags.filter((_, i) => i !== index))
                            }
                            handleAddition={(tag) =>
                              setTags([...tags, `#${tag.text}`])
                            }
                            handleDrag={handleDrag}
                            classNames={{
                              tags: "flex w-full",
                              tagInput: "flex",
                              tagInputField:
                                "outline-none  border border-skin-react-tags-input text-skin-react-tag-input-text-tags  text-sm rounded-sm focus:ring-skin-react-tag-ring-input focus:border-skin-react-tags-input-focus block w-full p-2.5",
                              selected: "selected-tag w-full",
                              tag: "inline-flex items-center active text-skin-library-tags-box text-sm font-medium rounded-full px-3 py-1 mr-2 mb-2",
                              remove: "ml-1",
                            }}
                            placeholder={t("add_new_tag")}
                            autofocus={false}
                            maxLength={50}
                            delimiters={[13, 32]}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <ICFileUpload
                          title={t("upload_cover_image")}
                          maxFiles={1}
                          maxFileSizeMB={50}
                          acceptedFileTypes={[FILE_UPLOAD_TYPE.Png]}
                          onFilesSelected={setSelectedFiles}
                          selectedFiles={selectedCoverImage}
                          setSelectedFiles={setSelectedCoverImage}
                          data={coverImage}
                          setData={setCoverImage}
                        />
                        {submitCount > 0 && selectedFiles.length === 0 && (
                          <div className="typo-error mb-1">
                            {prepareMessageFromParams(
                              t("error_message_required"),
                              [["fieldName", t("upload_cover_image")]]
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <ICFileUpload
                          title={t("upload_other_files")}
                          maxFiles={5}
                          maxFileSizeMB={50}
                          acceptedFileTypes={[
                            FILE_UPLOAD_TYPE.Jpg,
                            FILE_UPLOAD_TYPE.Pdf,
                            FILE_UPLOAD_TYPE.Png,
                            FILE_UPLOAD_TYPE.Jpeg,
                            FILE_UPLOAD_TYPE.Video,
                          ]}
                          onFilesSelected={setSelectedFiles}
                          selectedFiles={selectedFiles}
                          setSelectedFiles={setSelectedFiles}
                          data={blogsImage}
                          setData={setBlogsImage}
                        />
                        {submitCount > 0 && selectedFiles.length === 0 && (
                          <div className="typo-error mb-1">
                            {prepareMessageFromParams(
                              t("error_message_required"),
                              [["fieldName", t("upload_other_files")]]
                            )}
                          </div>
                        )}
                      </div>
                      <div className="checkbox-wrapper mb-6 flex items-center justify-between mt-4">
                        <ICCheckbox
                          id={`checkbox`}
                          name="post_anonymously"
                          value={formikPorps.values.post_anonymously}
                          onChange={(e) => {
                            formikPorps.handleChange(e);
                            formikPorps.setFieldValue(
                              "post_anonymously",
                              e.target.checked ? "1" : "0"
                            );
                          }}
                          labelComponent={
                            <p className="mx-2">{t("post_anonymously")}</p>
                          }
                        />
                      </div>
                      <div className="top w-full flex">
                        {(values.published === "0" ||
                          values.published === "") && (
                          <ICButton
                            type="submit"
                            children={t("save_draft")}
                            loading={loading}
                            className="mx-2"
                            onClick={() => updatePublishValue("0")}
                            disabled={loading}
                          />
                        )}
                        <ICButton
                          type="submit"
                          children={t("post")}
                          loading={loading}
                          onClick={() => updatePublishValue("1")}
                          className="mx-2"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerCreatePost;
