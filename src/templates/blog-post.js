import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import ViewCounter from "../components/page-views"
import "./blog-post.css"


const BlogPostTemplate = ({
  data: { site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const image = getImage(post.frontmatter.heroImage)

  // Ensure pageUrl is only set when window is available
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Layout location={location} title={siteTitle}>
      <article>
        <div class="hero">
          <GatsbyImage class="image" image={image} alt="Post Image" />
        </div>
        <div class="prose">
          <div class="blog-title">
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              opacity: 0.8,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div class="date">
                <p style={{ margin: 0 }}>{post.frontmatter.date}</p>
              </div>/

              {/* TODO */}
              {/* Page Views */}
              <ViewCounter url={pageUrl} />
            </div>
            <h1 style={{ fontWeight: 100 }}>{post.frontmatter.title}</h1>
            <hr />
          </div>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        heroImage {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  }
`
